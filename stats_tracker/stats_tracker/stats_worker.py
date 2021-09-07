import sys

import time

import signal

import argparse

import logging

from prometheus_client import start_http_server, Summary, Counter

from app import init_stats_tracker

from config import get_config

from workers.worker_manager import WorkerManager
from workers.event_stream_workers import GameEventWorker


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
        help="Valid modes: [development, test, production]",
        required=True,
        action="store",
    )
    args = parser.parse_args()
    config = get_config(args.mode)
    logging.basicConfig(format=config.LOG_FORMAT, level=config.LOG_LEVEL)
    logging.info(f"Initializing stats tracker worker...")
    init_stats_tracker(get_config(args.mode).STATS_TRACKER_REDIS_URL)
    logging.info(f"Starting worker manager...")
    worker_manager = WorkerManager()
    worker_manager.register_worker(
        GameEventWorker(get_config(args.mode).EVENT_STREAM_URL)
    )
    logging.info(f"Starting HTTP server to expose worker metrics...")
    start_http_server(5002)
    logging.info("Done.")

    # Signal and Metrics handling
    sigHandler = SignalHandler()
    s = Summary(
        f"stats_worker_execution_time", f"Execution time for stats tracker workers."
    )
    c = Counter(
        "stats_worker_events_processed",
        "Count of events processed by the Stats Tracker",
    )
    logging.info("Initialization complete.")
    logging.info("Starting worker main loop...")
    while not sigHandler.terminate:
        logging.debug("Running workers...")
        events_processed = 0
        with s.time():
            events_processed = worker_manager.run_workers()
        c.inc(events_processed)
        logging.debug("Run complete, going to sleep for 0.1 seconds")
        time.sleep(0.1)  # Give the CPU a break
    logging.info("Termination signal received - stopping worker")
