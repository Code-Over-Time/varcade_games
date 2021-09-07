import os

import logging

from typing import Optional


class Config(object):
    DEBUG = True
    TESTING = True
    LOG_FORMAT = "[%(asctime)s] [%(levelname)s] %(message)s"
    LOG_LEVEL = os.environ.get("LOG_LEVEL") or logging.INFO
    SECRET_KEY = os.environ.get("SECRET_KEY") or "password"
    STATS_TRACKER_REDIS_URL: Optional[str] = "redis://redis-db:6379/2"
    EVENT_STREAM_URL: Optional[str] = "redis://redis-db:6379/1"


class TestConfig(Config):
    EVENT_STREAM_URL: Optional[str] = "redis://localhost:6379/1"
    STATS_TRACKER_REDIS_URL: Optional[str] = "redis://localhost:6379/2"


class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    STATS_TRACKER_REDIS_URL: Optional[str] = os.environ.get("STATS_TRACKER_REDIS_URL")
    EVENT_STREAM_URL: Optional[str] = os.environ.get("GAME_EVENT_STREAM_REDIS_URL")


def get_config(mode):
    if "development" == mode:
        return Config
    elif "test" == mode:
        return TestConfig
    elif "production" == mode:
        return ProductionConfig
    raise ValueError(
        f"Invalid configuration specified: ${mode}. "
        f"Supported options: [development, test, production]"
    )
