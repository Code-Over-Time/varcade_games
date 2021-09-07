import logging

import uuid
import json

import jwt
from jwt.exceptions import DecodeError

from werkzeug.local import LocalProxy

from flask import Blueprint, make_response, current_app, request, abort

from core.game_servers import get_game_server_controller
from core.game_server_api import (
    send_create_game_request,
    send_join_game_request,
    send_remove_game_request,
    GameServerNetworkError,
)

from game_data.dao import get_game_dao, GameTransaction
from game_data.models import Game, GameState, UserProfile


game_lobby = Blueprint("game_lobby", __name__)


@game_lobby.route("/<product_id>/create_game", methods=["POST"])
def create_new_game(product_id):
    """Creates a new game.

    A request is first sent to the actual game server that the game will
    be played on. Once a token has been received from the remote game
    server, a Game object is stored in the matchmaker DB and the game
    data is returned to the client.
    """
    game_server = _get_game_server(product_id)
    user_profile = _authorize_user()

    # Create the actual game - object constructor will do data validation
    new_game = Game(
        uuid.uuid4().hex,
        product_id,
        game_server.game_server_url,
        user_profile.user_id,
        user_profile.username,
        **game_server.settings,
    )

    logging.info(
        f"Game Lobby: Creating a new game. "
        f"ID={new_game.game_id}, User ID={user_profile.user_id}"
    )

    try:
        # Create the game instance on the remote server.
        remote_game = send_create_game_request(
            new_game.creator_id, user_profile.username, new_game.game_id, game_server
        )
        new_game.token = remote_game["gameToken"]

    except GameServerNetworkError as e:
        logging.error(str(e))
        return "Unable to create game on target game server.", 400
    except Exception as e:
        logging.exception("Game Lobby: Unexpected error trying to create remote game.")
        return "An unexpected error occurred. Pleace contact support.", 500

    # Persist the game
    try:
        get_game_dao().create_game(new_game)
        logging.info(f"Game created, model data: {new_game}")
        return _get_joinable_game_response(game_server, new_game), 200
    except:
        # Try to clean up on the game server side
        try:
            send_remove_game_request(game_server, new_game.game_id)
        except:
            logging.exception(
                "Game Lobby: Unable to remove remote game after creation failure."
            )
            abort(500, "Game Lobby: Error saving the game. Please contact support.")

        logging.exception("Game Lobby: Unexpected error trying to create a game.")
        abort(500, "Game Lobby: Error saving the game. Please contact support.")


@game_lobby.route("/<product_id>/join_game/<game_id>", methods=["POST"])
def join_game(product_id, game_id):
    game_server = _get_game_server(product_id)
    user_profile = _authorize_user()
    _check_can_join_game(product_id, game_id)
    try:
        #  Join the game instance on the remote server.
        send_join_game_request(
            user_profile.user_id, user_profile.username, game_id, game_server
        )
    except GameServerNetworkError as e:
        logging.error(str(e))
        return "Unable to join game on target game server.", 400
    except Exception as e:
        logging.exception("Game Lobby: Unexpected error trying to create remote game.")
        return "An unexpected error occurred. Please contact support.", 500

    with GameTransaction(product_id, game_id) as (game_dao, game):
        if game is None:
            # Edge case - game could be expired between call to 'can_join_game' and now
            return "GameLobby: Cannot join game - it is no longer available", 400
        game.add_player(user_profile.user_id)
        game_dao.start_game(game)

        return _get_joinable_game_response(game_server, game), 200


@game_lobby.route("/<product_id>/open_games", methods=["GET"])
def get_open_games(product_id):
    try:
        entry_count = int(
            request.args.get("count", current_app.config["LOBBY_DEFAULT_PAGE_SIZE"])
        )
        page_index = int(request.args.get("page", 0))
    except ValueError:
        return "Invalid request - page size and entry count must be integers.", 400

    available_games = get_game_dao().get_available_games(
        product_id,
        page_index,
        min(entry_count, current_app.config["LOBBY_MAX_PAGE_SIZE"]),
    )
    return json.dumps([game.to_dict(partial=True) for game in available_games]), 200


def _get_joinable_game_response(game_server, game_data):
    response_data = game_data.to_dict()
    response_data["target_game_server"] = game_server.game_socket_url
    return json.dumps(response_data)


def _check_can_join_game(product_id, game_id):
    """Check the game model and state to ensure that the game can be
    joined. Will abort the request if:

    - The game does not exist
    - The game state is not valid for joining (ie. != CREATOR_JOINED)
    """
    game = get_game_dao().get_game_by_id(product_id, game_id)
    if game is None:
        logging.info(
            f"User attempted to join non existent game."
            f"Game ID: {game_id}, Product ID: {product_id}."
        )
        abort(
            404,
            f"Game Lobby: Unable to join game - game not found. "
            f'Game ID: "{game_id}", Product ID: {product_id}.',
        )
    if game.state == GameState.CREATOR_JOINED:
        return True

    abort(
        400,
        f"Unable to join game - invalid state: {game.state}. Required state: {GameState.CREATOR_JOINED}",
    )


def _authorize_user():
    """Read the authorization headers from the request and use it to fetch
    the users profile from the web portal profile service.

    returns:    A UserProfile object corresponding to the auth header
    """
    if "Authorization" not in request.headers:
        logging.warning("Game Lobby: Invalid request received, auth header missing")
        abort(401, "Game Lobby: Not authorized.")

    try:
        token = request.headers["Authorization"].split(" ")[1]
        user_data = jwt.decode(
            token, current_app.config["SECRET_KEY"], algorithms=["HS256"]
        )
        logging.info(user_data)
        return UserProfile(user_data["user_id"], user_data["username"])
    except:
        logging.exception("Unable to decode token.")
        abort(
            401,
            "Game Lobby: Unable to fetch user profile for user. Relog may be required.",
        )


def _get_game_server(product_id):
    game_server = get_game_server_controller().get_game_server(product_id)

    if game_server is None:
        logging.error(
            f"Game Lobby: Invalid request received. Unknown product: {product_id}"
        )
        abort(400, "Game Lobby: Invalid product ID.")

    return game_server
