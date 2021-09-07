import pytest

import redis

from app import create_app, init_stats_tracker

import core.db as db_module
from core.db import initialise_db, get_stats_tracker_db

from config import get_config


@pytest.fixture
def test_db_url():
    return get_config("test").STATS_TRACKER_REDIS_URL


@pytest.fixture(scope="session", autouse=True)
def load_stats_tracker_handlers(request):
    init_stats_tracker(get_config("test").STATS_TRACKER_REDIS_URL)


@pytest.fixture(scope="function")
def stats_tracker_db():
    yield get_stats_tracker_db()
    get_stats_tracker_db().flushdb()


@pytest.fixture(scope="function")
def test_client():
    flask_app = create_app("test")
    testing_client = flask_app.test_client()
    testing_client.config = flask_app.config
    ctx = flask_app.app_context()
    ctx.push()
    yield testing_client
    ctx.pop()


@pytest.fixture
def test_game_over_event():
    return {
        "product_id": "exrps",
        "type": "game_over",
        "winner_id": "userA",
        "loser_id": "userB",
    }


@pytest.fixture
def test_weapon_select_event():
    return {
        "product_id": "exrps",
        "event_name": "select_weapon",
        "user_id": "userA",
        "event_data": "1",
    }


@pytest.fixture
def sample_game_event_stream_events():
    return [
        [
            b"test_stream",
            [
                (
                    b"first_event_index",
                    {
                        b"product_id": b"exrps",
                        b"event_name": b"select_weapon",
                        b"user_id": b"userA",
                        b"event_data": b"1",
                    },
                ),
                (
                    b"second_event_index",
                    {
                        b"product_id": b"exrps",
                        b"type": b"game_over",
                        b"winner_id": b"userA",
                        b"loser_id": b"userB",
                    },
                ),
                (
                    b"last_event_index",
                    {
                        b"product_id": b"exrps",
                        b"type": b"game_over",
                        b"winner_id": b"userA",
                        b"loser_id": b"userB",
                    },
                ),
            ],
        ]
    ]


@pytest.fixture
def invalid_event_product_id():
    return [
        [
            b"test_stream",
            [
                (
                    b"first_event_index",
                    {
                        b"product_id": b"INVALID",
                        b"event_name": b"select_weapon",
                        b"user_id": b"userA",
                        b"event_data": b"1",
                    },
                )
            ],
        ]
    ]


@pytest.fixture
def invalid_result_product_id():
    return [
        [
            b"test_stream",
            [
                (
                    b"first_event_index",
                    {
                        b"product_id": b"exrps",
                        b"event_name": b"select_weapon",
                        b"user_id": b"userA",
                        b"event_data": b"1",
                    },
                )
            ],
        ]
    ]


@pytest.fixture
def invalid_event_missing_key():
    return [
        [
            b"test_stream",
            [
                (
                    b"first_event_index",
                    {
                        b"product_id": b"exrps",
                        b"event_name": b"select_weapon",
                        b"event_data": b"1",
                    },
                )
            ],
        ]
    ]
