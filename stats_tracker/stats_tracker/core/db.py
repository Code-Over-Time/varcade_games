import logging

import redis


_STATS_TRACKER_DB = None


def initialise_db(db_url: str):
    global _STATS_TRACKER_DB
    logging.info(f"Initialising stats tracker DB. Redis URL {db_url}.")
    if _STATS_TRACKER_DB is None:
        _STATS_TRACKER_DB = redis.from_url(db_url)


def get_stats_tracker_db():
    if _STATS_TRACKER_DB is None:
        logging.error(
            f"'get_stats_tracker_db()' was called before the db was initialised. "
            f"Did you call stats_tracker.core.db.initialise_db()?"
        )
    return _STATS_TRACKER_DB
