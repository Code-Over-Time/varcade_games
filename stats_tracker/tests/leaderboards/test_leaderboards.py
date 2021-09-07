import json

import pytest

from unittest.mock import patch, MagicMock

from redis import WatchError

from core.db import initialise_db, get_stats_tracker_db

from leaderboards.leaderboards import (
    record_result,
    get_top_players,
    get_user_rank,
    get_leaderboard_handler,
    register_leaderboard_handler,
)
from leaderboards.handlers import LeaderboardHandler


class TestLeaderboards:
    def test_record_result(self, stats_tracker_db):
        record_result("exrps", "winner", "loser")

    def test_get_top_players(self, stats_tracker_db):
        record_result("exrps", "userA", "userB")
        record_result("exrps", "userA", "userB")
        record_result("exrps", "userB", "userA")
        top_ten = get_top_players("exrps")

        assert len(top_ten) == 2
        assert top_ten[0]["user_id"] == "userA"
        assert top_ten[0]["score"] == 2
        assert top_ten[1]["user_id"] == "userB"
        assert top_ten[1]["score"] == 1

    def test_get_user_rank(self, stats_tracker_db):
        record_result("exrps", "winner", "loser")
        assert get_user_rank("exrps", "winner") == 1
        assert get_user_rank("exrps", "loser") == 0


class TestLeaderboardDefaultHandler:
    def test_default_leaderboard_handler_score_calculation(self):
        handler = LeaderboardHandler()
        assert handler.get_updated_scores("winner", None, "loser", None) == (1, 0)
        assert handler.get_updated_scores("winner", 0, "loser", 0) == (1, 0)
        assert handler.get_updated_scores("winner", 1, "loser", 1) == (2, 1)
        assert handler.get_updated_scores("winner", -1, "loser", 0) == (0, 0)

    def test_register_leaderboard_handler(self):
        # Should be no issues here
        register_leaderboard_handler("product_a", LeaderboardHandler())
        assert get_leaderboard_handler("product_a") is not None

        with pytest.raises(ValueError):  # Invalid handler type
            register_leaderboard_handler("product_b", {})


class TestLeaderboardsApi:
    def test_get_leaderboard(self, stats_tracker_db, test_client):
        response = test_client.get(f"leaderboards/top_ten/exrps")
        assert response.status_code == 200
        assert json.loads(response.data) == []

        record_result("exrps", "userA", "userB")
        response = test_client.get(f"leaderboards/top_ten/exrps")
        assert response.status_code == 200
        assert json.loads(response.data) == [
            {"score": 1.0, "user_id": "userA"},
            {"score": 0.0, "user_id": "userB"},
        ]


@patch("leaderboards.leaderboards.get_stats_tracker_db")
class TestLeaderboardTransactionErrorWithMocks:
    def test_record_result_transaction_error(self, mocked_tracker_db_function_call):
        # Create a mock for the pipeline that will be used for the transaction
        pipeline_mock = MagicMock()
        pipeline_mock.execute = MagicMock(side_effect=WatchError)

        # Mock out the redis object
        redis_mock = MagicMock()
        redis_mock.pipeline = MagicMock(return_value=pipeline_mock)
        mocked_tracker_db_function_call.return_value = redis_mock

        # Record result should return False because the transaction
        # cannot complete due to forced watch error
        assert record_result("exrps", "userB", "userA") is False

    def test_record_result_transaction_error(self, mocked_tracker_db_function_call):
        # We will use this function to keep track of how many watch errors we have
        # so we can verify that we can tolerate multiple watch errors before eventually
        # succeeding

        # It's a bit ugly - but the alternative is trying to force watch errors which
        # may be even uglier
        self.watch_error_count = 0

        def watch_error_counter():
            self.watch_error_count += 1
            print(f"Watch error count: {self.watch_error_count}")
            if self.watch_error_count > 3:
                return
            else:
                raise WatchError()

        pipeline_mock = MagicMock()
        pipeline_mock.execute = MagicMock(side_effect=watch_error_counter)

        redis_mock = MagicMock()
        redis_mock.pipeline = MagicMock(return_value=pipeline_mock)
        mocked_tracker_db_function_call.return_value = redis_mock

        assert record_result("exrps", "userB", "userA") is True
