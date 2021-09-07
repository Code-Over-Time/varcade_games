import os

import logging


class Config(object):
    DEBUG = True
    TESTING = True
    LOG_FORMAT = "[%(asctime)s] [%(levelname)s] %(message)s"
    LOG_LEVEL = os.environ.get("LOG_LEVEL") or logging.INFO
    REDIS_URL = "redis://redis-db:6379/0"
    CACHE_URL = "redis://redis-db:6379/3"
    EVENT_STREAM_URL = "redis://redis-db:6379/1"
    SECRET_KEY = "#_l=pv35+1%ch8c5)-y&)3mqac!u%_b!)ru7i8i1r&!lczqsw-"

    LOBBY_DEFAULT_PAGE_SIZE = 10
    LOBBY_MAX_PAGE_SIZE = 25
    ACTIVE_GAMES = [
        {
            "product_id": "exrps",
            "game_server_url": "http://game-rps:8080",
            "game_socket_url": "rps.varcade.local:8085",
            "settings": {"num_players": 2},
        }
    ]
    GAME_PURGE_PAGE_SIZE = 10


class TestConfig(Config):
    REDIS_URL = "redis://localhost:6379/0"
    CACHE_URL = "redis://localhost:6379/3"
    EVENT_STREAM_URL = "redis://localhost:6379/1"


class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    ACTIVE_GAMES = [
        {
            "product_id": "exrps",
            "game_server_url": "http://game-rps:8080",
            "game_socket_url": "rps.varcade-games.com",
            "settings": {"num_players": 2},
        }
    ]
    REDIS_URL = str(os.environ.get("MATCHMAKER_DB_REDIS_URL"))
    CACHE_URL = str(os.environ.get("MATCHMAKER_CACHE_REDIS_URL"))
    EVENT_STREAM_URL = str(os.environ.get("GAME_EVENT_STREAM_REDIS_URL"))


def get_config(mode):
    if "development" == mode:
        return Config
    elif "test" == mode:
        return TestConfig
    elif "production" == mode:
        return ProductionConfig
    raise ValueError(
        f"Invalid mode specific on startup: {mode}. "
        f"Must be one of [development, test, production]"
    )
