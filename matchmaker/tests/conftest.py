import pytest

import redis

import jwt

from app import create_app
from config import get_config

from game_data import dao as dao_module
from game_data.dao import GameDao, initialise_db
from game_data.models import Game, GameState, UserProfile
from config import Config

from workers.worker_manager import AsyncWorker


@pytest.fixture(scope="class")
def dao_instance(request):
    conn = redis.Redis.from_url("redis://localhost:6379/0")
    request.cls.redis_instance = conn
    request.cls.dao = GameDao(conn)


@pytest.fixture(scope="class")
def test_games(request):
    request.cls.test_game = Game(
        "_gameuid1", "exrps", "localhost", "userA", "userAname", test_setting=1
    )

    active_game = Game("_gameuid2", "exrps", "localhost", "userA", "userAname")
    active_game.state = GameState.CREATOR_JOINED
    request.cls.test_active_game = active_game


@pytest.fixture(scope="class")
def test_game_server_config(request):
    request.cls.test_game_server_config = [
        {
            "product_id": "test_gs",
            "game_server_url": "http://test_gs.com",
            "game_socket_url": "http://test_gs.com",
        },
        {
            "product_id": "test_gs2",
            "game_server_url": "http://test_gs2.com",
            "game_socket_url": "http://test_gs.com",
        },
    ]


@pytest.fixture(scope="class")
def init_db(request):
    config = get_config("test")
    initialise_db(config.REDIS_URL, config.CACHE_URL)
    yield
    dao_module.game_dao = None
    dao_module.game_cache = None


@pytest.fixture(scope="module")
def test_client():
    flask_app = create_app("test")
    testing_client = flask_app.test_client()
    testing_client.config = flask_app.config
    ctx = flask_app.app_context()
    ctx.push()
    yield testing_client
    ctx.pop()


@pytest.fixture(scope="module")
def create_request_body():
    return {"creator_id": "UserA"}


@pytest.fixture(scope="module")
def valid_product_id():
    return "exrps"


@pytest.fixture(scope="module")
def user_profile_A():
    return UserProfile("UserA", "Aaaa")


@pytest.fixture(scope="module")
def user_profile_B():
    return UserProfile("UserB", "Bbbb")


@pytest.fixture(scope="module")
def user_profile_A_jwt_token(user_profile_A):
    return jwt.encode(
        {"user_id": user_profile_A.user_id, "username": user_profile_A.username},
        Config.SECRET_KEY,
        "HS256",
    )


@pytest.fixture(scope="module")
def user_profile_B_jwt_token(user_profile_B):
    return jwt.encode(
        {"user_id": user_profile_B.user_id, "username": user_profile_B.username},
        Config.SECRET_KEY,
        "HS256",
    )


@pytest.fixture(scope="module")
def game_token():
    return {"gameToken": "abc123"}


@pytest.fixture(scope="module")
def dummy_worker_class():
    class DummyWorker(AsyncWorker):
        def __init__(self):
            self.run_call_count = 0

        def run(self):
            self.run_call_count += 1
            return 1

        def get_name(self):
            return "Dummy worker"

    return DummyWorker


@pytest.fixture
def dummy_user_profile():
    return UserProfile("UserA", "Aaaa")


@pytest.fixture
def sample_game_event_stream_events():
    return [
        [
            b"test_stream",
            [
                (
                    b"first_event_index",
                    {
                        b"product_id": b"test_product_id",
                        b"game_id": b"test_game_id",
                        b"type": b"state_change",
                        b"new_state": b"1",
                    },
                ),
                (
                    b"last_event_index",
                    {
                        b"product_id": b"test_product_id",
                        b"game_id": b"test_game_id",
                        b"type": b"state_change",
                        b"new_state": b"2",
                    },
                ),
            ],
        ]
    ]


@pytest.fixture
def sample_user_event_stream_events():
    return [
        [
            b"test_stream",
            [
                (
                    b"first_event_index",
                    {
                        b"type": b"user_login",
                        b"user_id": b"userA",
                        b"username": b"Aaaa",
                        b"level": 1,
                        b"token": b"abc123",
                    },
                ),
                (
                    b"middle_event_index",
                    {
                        b"type": b"some_other_user_event",
                        b"user_id": b"userA",
                        b"username": b"Aaaa",
                        b"level": 1,
                        b"token": b"abc123",
                    },
                ),
                (
                    b"last_event_index",
                    {
                        b"type": b"user_login",
                        b"user_id": b"userB",
                        b"username": b"Bbbb",
                        b"level": 1,
                        b"token": b"123abc",
                    },
                ),
            ],
        ]
    ]


@pytest.fixture
def game_server_game_data():
    return {
        "gameId": "def456",
        "numPlayers": 2,
        "state": "0",
        "creatorId": "UserA",
        "round": 1,
        "players": ["UserA"],
        "rounds": 1,
        "playersConnected": ["UserA"],
        "gameToken": "abc123",
    }
