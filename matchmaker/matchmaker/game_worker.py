import signal
import time

import argparse

import logging

from prometheus_client import start_http_server, Summary, Counter

from config import get_config

from workers.worker_manager import WorkerManager
from workers.event_stream_workers import GameEventWorker
from workers.game_management_workers import GameCurationWorker


# For graceful app shutdown
class SignalHandler:
    def __init__(self):
        self.terminate = False
        signal.signal(signal.SIGINT, self.handle_termination)
        signal.signal(signal.SIGTERM, self.handle_termination)

    def handle_termination(self, signum, frame):
        self.terminate = True


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-m",
        "--mode",
        help="Supported modes: [development, production, test]",
        required=True,
        action="store",
    )
    args = parser.parse_args()
    config = get_config(args.mode)
    logging.basicConfig(format=config.LOG_FORMAT, level=config.LOG_LEVEL)
    logging.info(f"Starting matchmaker worker with {args.mode} config...")

    worker_manager = WorkerManager()
    worker_manager.register_worker(GameCurationWorker(config))
    worker_manager.register_worker(GameEventWorker(config.EVENT_STREAM_URL))

    logging.info(f"Starting HTTP server to expose worker metrics...")
    start_http_server(5051)
    logging.info("Done.")

    # Signal and Metrics handling
    sigHandler = SignalHandler()
    s = Summary(
        f"matchmaker_worker_execution_time", f"Execution time for matchmaker workers."
    )
    c = Counter(
        "matchmaker_worker_events_processed",
        "Count of events processed by the Stats Tracker",
    )

    logging.info("Starting worker main loop...")
    while not sigHandler.terminate:
        events_processed = 0
        with s.time():
            events_processed = worker_manager.run_workers()
        c.inc(events_processed)
        time.sleep(0.1)  # Give the CPU a break
    logging.info("Termination signal received - stopping worker")
