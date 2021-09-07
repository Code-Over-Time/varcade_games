import json

import logging

import requests


def send_create_game_request(user_id, user_name, game_id, game_server):
    """Sends a 'create game' request to the remote game server.

    :param str user_id:                             The ID of the user creating the game
    :param str user_name:                           The username of the user creating the game
    :param str game_id:                             UID of the new game being created
    :param matchmaker.core.GameServer game_server:  the target game server

    :returns:   A dict containing the 'token' for the game that was created
    :rtype:     dict

    :raises GameServerNetworkError: If the response from the remote game server is not a 200
    """
    request_data = {"gameId": game_id, "userId": user_id, "username": user_name}
    return _send_request(game_server, "create_game", request_data)


def send_join_game_request(user_id, user_name, game_id, game_server):
    """Sends a 'join game' request to the remote game server.

    :param user_id:         The ID of the user trying to join a game
    :param user_name:       The username of the user trying to join a game
    :param game_id:         UID of the game
    :param game_server:     core.game_servers.GameServer object representing the target server

    :returns:    A dict containing game data from the remote server (not used by matchmaker)

    :raises GameServerNetworkError: If the response from the remote game server is not a 200
    """
    request_data = {"gameId": game_id, "userId": user_id, "username": user_name}
    return _send_request(game_server, "join_game", request_data)


def send_remove_game_request(game_server, game_id):
    """Sends a 'remove game' request to the remote game server, resulting in all players
    being disconnected and the game removed.

    :param game_server:     core.game_servers.GameServer object representing the target server
    :param game_id:         UID of the game to remove

    :returns:    A dict containing game data from the remote server (not used by matchmaker)
    :raises GameServerNetworkError: If the response from the remote game server is not a 200
    """
    request_data = {"gameId": game_id}
    return _send_request(game_server, "remove_game", request_data)


def send_remove_player_request(game_server, game_id, user_id):
    """Sends a 'remove player' request to the remote game server, resulting in the specified
    player being removed. The matchmaker should not send remove player requests for the host
    as game servers should not support this. 'Remove game' should be called instead.

    :param game_server:     core.game_servers.GameServer object representing the target server
    :param game_id:         UID of the game to remove
    :param user_id:         UID of the user to remove

    :returns:    A dict containing the removal result, including whether any connections were closed
    :raises GameServerNetworkError: If the response from the remote game server is not a 200
    """
    request_data = {"gameId": game_id, "userId": user_id}
    return _send_request(game_server, "remove_player", request_data)


def _send_request(game_server, request_path, request_data):
    """Send a request to a remote game server.

    :param game_server:     Gameserver object representing the remote server
    :param request_path:    The URL path to send the request to
    :param request_data:    The post request body as a dict
    :return dict:           The response from the remote server, as a dict
    :raises GameServerNetworkError: If the response from the remote server is anything other than 200
    """
    url = f"{game_server.game_server_url}/{request_path}"

    logging.info(
        f"GameServerAPI: Sending request to remote game server. URL: {url}. Request Data: {request_data}"
    )

    response = requests.post(url, json=request_data)

    if response.status_code == 200:
        return json.loads(response.text)
    else:
        raise GameServerNetworkError(
            f"GameServerAPI: Request failed. URL: {url}, Request Data: {request_data}",
            response.status_code,
            response.text,
        )


class GameServerNetworkError(Exception):
    def __init__(self, message, status_code, response_body):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.response_body = response_body

    def __str__(self):
        return (
            f"Game Server Network Error: "
            f"{self.message}, status code: {self.status_code}, "
            f"Response body: {self.response_body}"
        )
