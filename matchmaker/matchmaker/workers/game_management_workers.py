import logging

import redis

from workers.worker_manager import AsyncWorker

from game_data.dao import get_game_dao, initialise_db, GameTransaction
from game_data.models import Game, GameState

from core.game_servers import initialise as initialise_game_server_interface

from core.game_servers import get_game_server_controller
from core.game_server_api import send_remove_game_request, send_remove_player_request


class GameCurationWorker(AsyncWorker):
    """Monitors the various game sets (pending, lobby, active). Removes any expired
    games based on the is_expired property of the game object
    """

    def __init__(self, config):
        self.config = config
        initialise_game_server_interface(config.ACTIVE_GAMES)
        initialise_db(config.REDIS_URL, config.CACHE_URL)
        self.dao = get_game_dao()

    def run(self, batch_size=10):
        return sum(
            [
                self.purge_expired_games(game_config["product_id"], batch_size)
                for game_config in self.config.ACTIVE_GAMES
            ]
        )

    def get_name(self):
        return "Game curation worker"

    def purge_expired_games(self, product_id, batch_size=10) -> int:
        """Remove any games from the pending/lobby/active sets that have been
        inactive for too long.

        The oldest games are read from the three sets and deleted if the 'is_expired'
        property of the game object returns True.

        product_id (str):The ID of the product whose games are being cleaned up
        batch_size (int):The number of games to process on each run
        """
        purged_game_count = 0
        for game_id in self.dao.get_oldest_pending_games(
            product_id, result_set_size=batch_size
        ):
            if self.purge_game_if_expired(product_id, game_id):
                purged_game_count += 1

        for game_id in self.dao.get_oldest_lobby_games(
            product_id, result_set_size=batch_size
        ):
            if self.purge_game_if_expired(product_id, game_id):
                purged_game_count += 1

        for game_id in self.dao.get_oldest_active_games(
            product_id, result_set_size=batch_size
        ):
            if self.purge_game_if_expired(product_id, game_id):
                purged_game_count += 1
        return purged_game_count

    def purge_game_if_expired(self, product_id, game_id) -> bool:
        """Delete a game from the game database if it has expired (as dictated by
        the is_expired property of the game object)

        product_id (str):The product ID of the game to be deleted if expired
        game_id (str):The ID of the game to be deleted if expired

        :returns bool:  True if a game was purged or reset, False otherwise
        """
        removed_game = None
        removed_player = None
        with GameTransaction(product_id, game_id) as (game_dao, game):
            if game is None:
                logging.warning(
                    f"An attempt was made to delete a non-existent game. "
                    f"Product ID: {product_id}, Game ID: {game_id}"
                )
                return False

            if game.needs_reset:
                logging.info(
                    f"Resetting game! Product ID = {product_id}, Game ID = {game_id}"
                )
                removed_player = game.reset_to_creator_joined()
                game_dao.reset_game(game)
            elif game.is_expired:
                logging.info(
                    f"Expiring game! Product ID = {product_id}, Game ID = {game_id}"
                )
                game_dao.delete_game(product_id, game_id)
                removed_game = game

        if removed_game:
            logging.info("Attempting to send clean up request to the game server...")
            game_server = get_game_server_controller().get_game_server(product_id)
            if game_server is None:
                logging.error(
                    f"GSM: Unable to clean up game - unknown product: {product_id}"
                )
            else:
                server_response = send_remove_game_request(game_server, game_id)
                logging.info(f"Server response: {server_response}")

        if removed_player:
            logging.info("Attempting to send reset request to the game server...")
            game_server = get_game_server_controller().get_game_server(product_id)
            if game_server is None:
                logging.error(
                    f"GSM: Unable to send remove player request - unknown product: {product_id}"
                )
            else:
                server_response = send_remove_player_request(
                    game_server, game_id, removed_player
                )
                logging.info(f"Server response: {server_response}")

        return True
