import logging

import redis

from workers.worker_manager import AsyncWorker

from game_data.dao import GameTransaction
from game_data.models import Game, GameState


GAME_EVENT_STREAM = "game_event_stream"


class EventStreamWorker(AsyncWorker):
    def __init__(self, redis_stream_url: str, stream_id: str, stream_index_key: str):
        self._stream_id = stream_id
        self._stream_index_key = stream_index_key
        self._event_stream = redis.Redis.from_url(redis_stream_url)
        logging.info(
            f"Initializing event stream worker. Processing will begin from stream index: {self.stream_index} on {redis_stream_url}"
        )

    def run(self, stream_processing_batch_size=10):
        # Get the stream index - either pick up where we left off or start from zero if we haven't processed events before
        stream_events = self._event_stream.xread(
            {self._stream_id: self.stream_index}, count=stream_processing_batch_size
        )
        if stream_events:
            logging.debug(
                f"Got {len(stream_events)} events(s) from event stream. Processing..."
            )
            current_stream_index, processed_event_count = self.process_events(
                stream_events
            )
            if current_stream_index:
                logging.debug(f"New stream index: {current_stream_index}")
                self._event_stream.set(self._stream_index_key, current_stream_index)
            return processed_event_count
        return 0

    @property
    def stream_index(self) -> str:
        return self._event_stream.get(self._stream_index_key) or "0-0"

    def process_events(self, stream_events):
        raise NotImplementedError()


class GameEventWorker(EventStreamWorker):
    """Monitors the game event stream and handles the received messages"""

    def __init__(self, redis_stream_url: str):
        super().__init__(
            redis_stream_url, GAME_EVENT_STREAM, "__game_event_stream_index"
        )

    def process_events(self, stream_events: list):
        current_stream_index = None
        processed_event_count = 0
        for event in stream_events[0][1]:
            current_stream_index = event[0]
            event_data = event[1]
            if event_data.get(b"type", None) == b"state_change":
                logging.info(f"Processing Stream Event: {event_data}")
                self.update_game_state(
                    event_data[b"product_id"].decode("utf-8"),
                    event_data[b"game_id"].decode("utf-8"),
                    event_data[b"new_state"].decode("utf-8"),
                )
                processed_event_count += 1
            elif event_data.get(b"type", None) == b"game_removed":
                self.handle_game_removal(
                    event_data[b"product_id"].decode("utf-8"),
                    event_data[b"game_id"].decode("utf-8"),
                )
                processed_event_count += 1
            elif event_data.get(b"type", None) == b"player_disconnect":
                self.handle_player_disconnect(
                    event_data[b"product_id"].decode("utf-8"),
                    event_data[b"game_id"].decode("utf-8"),
                    event_data[b"player_id"].decode("utf-8"),
                )
                processed_event_count += 1
        return current_stream_index, processed_event_count

    def handle_game_removal(self, product_id, game_id):
        with GameTransaction(product_id, game_id) as (game_dao, game):
            if game is None:
                logging.warning(
                    f"Received a removal event for a non-existent game. "
                    f"Product ID: {product_id}, Game ID: {game_id}"
                )
                return
            logging.info(
                f"Removing game. Game ID: {game_id}, Product ID: {product_id}, "
                f"Reason: Game server event"
            )
            game_dao.delete_game(product_id, game_id)

    def handle_player_disconnect(self, product_id, game_id, player_id):
        with GameTransaction(product_id, game_id) as (game_dao, game):
            if game is None:
                logging.warning(
                    f"Received a player disconnect event for a non-existent game. "
                    f"Product ID: {product_id}, Game ID: {game_id}"
                )
                return
            logging.info(
                f"Resetting game. Game ID: {game_id}, Product ID: {product_id}, "
                f"Reason: Player (non-host) disconnected"
            )
            game.reset_to_creator_joined()
            game_dao.reset_game(game)

    def update_game_state(self, product_id: str, game_id: str, new_state: str):
        """Update the state of a game based on an event received from the event stream. This method
        will check that the state transition is valid based on game_data.models.GameState before
        writing any changes to the data model.

        :param product_id:  The game's product ID
        :param game_id:     The game's ID
        :param new_state:   The state to transition the game to

        :returns:   True if the game was updated, False otherwise (if the game doesn't exist or the state transition is invalid)
        """
        with GameTransaction(product_id, game_id) as (game_dao, game):
            if game is None:
                logging.warning(
                    f"An attempt was made to update the state of a non-existant game. "
                    f"Product ID: {product_id}, Game ID: {game_id}, New State: {new_state}"
                )
                return False

            if GameState.is_valid_state_transition(game.state, new_state):
                logging.info(
                    f"Updating state of game: {product_id}-{game_id}."
                    f"Old state: {game.state}. New state: {new_state}"
                )
                game.state = new_state

                # TODO: Should add some sort of state handlers here
                if new_state == GameState.CREATOR_JOINED:
                    logging.info(
                        f"Game creater joined: {product_id}-{game_id}. Activating game."
                    )
                    game_dao.publish_game(game)
                game_dao.update_game(game)
                return True
            else:
                logging.warning(
                    f"An attempt was made to change game state to an invalid state. "
                    f"Product ID: {product_id}, Game ID: {game_id}, Old State: {game.state}. New State: {new_state}"
                )
                return False

    def get_name(self):
        return "Game event worker"
