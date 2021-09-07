import logging

import redis

from core.errors import InvalidProductIdError

from workers.worker_manager import AsyncWorker

from leaderboards.leaderboards import record_result

from player_stats.player_stats import track_event

GAME_EVENT_STREAM = "game_event_stream"


class EventStreamWorker(AsyncWorker):
    def __init__(self, redis_stream_url: str, stream_id: str, stream_index_key: str):
        self._stream_id = stream_id
        self._stream_index_key = stream_index_key
        self._event_stream = redis.Redis.from_url(redis_stream_url)
        logging.info(
            f"Initialising event stream worker. Processing will begin from stream index: {self.stream_index} on {redis_stream_url}"
        )

    def run(self, stream_processing_batch_size=10):
        # Get the stream index - either pick up where we left off or start from zero if we haven't processed events before
        stream_events = self._event_stream.xread(
            {self._stream_id: self.stream_index}, count=stream_processing_batch_size
        )
        if stream_events:
            logging.debug(
                f"EventStreamWorker: Got {len(stream_events)} events(s) from event stream."
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

    def process_events(self, stream_events) -> (str, int):
        raise NotImplementedError()


class GameEventWorker(EventStreamWorker):
    """Monitors the game event stream and handles the received messages"""

    def __init__(self, redis_stream_url: str):
        super().__init__(
            redis_stream_url,
            GAME_EVENT_STREAM,
            "_stats_tracker.workers.event_stream_index",
        )

    def process_events(self, stream_events: list):
        current_stream_index = None
        processed_event_count = 0
        for event in stream_events[0][1]:
            current_stream_index = event[0]
            event_data = event[1]
            logging.info(f"GameEventWorker: Received Stream Event: {event_data}")
            try:
                if event_data.get(b"type", None) == b"game_over":
                    logging.info(f"Processing Stream Event: {event_data}")
                    product_id = event_data[b"product_id"].decode("utf-8")
                    winner_id = event_data[b"winner_id"].decode("utf-8")
                    loser_id = event_data[b"loser_id"].decode("utf-8")
                    record_result(product_id, winner_id, loser_id)
                    processed_event_count += 1

                if event_data.get(b"product_id", None) is not None:
                    product_id = event_data[b"product_id"].decode("utf-8")
                    track_event(
                        product_id,
                        {
                            a.decode("utf-8"): b.decode("utf-8")
                            for a, b in event_data.items()
                        },
                    )
                    processed_event_count += 1
            except InvalidProductIdError:
                # This is critical because misconfigured product IDs can cause us to miss
                # important game events
                logging.critical(f"Unexpected product id received in event: {event}")
            except Exception as err:
                logging.exception(f"Unable to process event: {event}. Error: {err}")

        return current_stream_index, processed_event_count

    def get_name(self):
        return "game event worker"
