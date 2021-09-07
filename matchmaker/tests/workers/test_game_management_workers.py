import datetime

from unittest.mock import patch, MagicMock

import pytest

from config import get_config

from game_data.models import Game, GameState
from workers.game_management_workers import GameCurationWorker


class TestGameCurationWorkerFlowWithMocks:
    def setup_method(self):
        self.config = get_config("test")
        self.worker = GameCurationWorker(get_config("test"))

    def teardown_method(self):
        self.worker.dao.db.flushdb()

    def test_override_methods(self):
        assert self.worker.get_name() == "Game curation worker"

    def test_nothing_to_purge(self):
        self._create_mocks([], [], [])
        self.worker.run()
        for game_config in self.config.ACTIVE_GAMES:
            self.worker.dao.get_oldest_pending_games.assert_called_with(
                game_config["product_id"], result_set_size=10
            )
            self.worker.dao.get_oldest_lobby_games.assert_called_with(
                game_config["product_id"], result_set_size=10
            )
            self.worker.dao.get_oldest_active_games.assert_called_with(
                game_config["product_id"], result_set_size=10
            )
        self.worker.purge_game_if_expired.assert_not_called()

    def test_all_sets_purge(self):
        self._create_mocks(
            ["expired_pending_game_id"],
            ["expired_active_game_id"],
            ["expired_lobby_game_id"],
        )
        self.worker.run()

        for game_config in self.config.ACTIVE_GAMES:
            self.worker.dao.get_oldest_pending_games.assert_called_with(
                game_config["product_id"], result_set_size=10
            )
            self.worker.dao.get_oldest_lobby_games.assert_called_with(
                game_config["product_id"], result_set_size=10
            )
            self.worker.dao.get_oldest_active_games.assert_called_with(
                game_config["product_id"], result_set_size=10
            )

            self.worker.purge_game_if_expired.assert_any_call(
                game_config["product_id"], "expired_pending_game_id"
            )
            self.worker.purge_game_if_expired.assert_any_call(
                game_config["product_id"], "expired_active_game_id"
            )
            self.worker.purge_game_if_expired.assert_any_call(
                game_config["product_id"], "expired_lobby_game_id"
            )

    def test_pending_set_purge(self):
        self._create_mocks(["expired_pending_game_id"], [], [])
        self.worker.run()

        for game_config in self.config.ACTIVE_GAMES:
            self.worker.dao.get_oldest_pending_games.assert_called_with(
                game_config["product_id"], result_set_size=10
            )
            self.worker.dao.get_oldest_lobby_games.assert_called_with(
                game_config["product_id"], result_set_size=10
            )
            self.worker.dao.get_oldest_active_games.assert_called_with(
                game_config["product_id"], result_set_size=10
            )

            self.worker.purge_game_if_expired.assert_called_once_with(
                game_config["product_id"], r"expired_pending_game_id"
            )

    def test_lobby_set_purge(self):
        self._create_mocks([], [], ["expired_lobby_game_id"])
        self.worker.run()

        for game_config in self.config.ACTIVE_GAMES:
            self.worker.dao.get_oldest_pending_games.assert_called_with(
                game_config["product_id"], result_set_size=10
            )
            self.worker.dao.get_oldest_lobby_games.assert_called_with(
                game_config["product_id"], result_set_size=10
            )
            self.worker.dao.get_oldest_active_games.assert_called_with(
                game_config["product_id"], result_set_size=10
            )

            self.worker.purge_game_if_expired.assert_called_once_with(
                game_config["product_id"], r"expired_lobby_game_id"
            )

    def test_active_set_purge(self):
        self._create_mocks([], ["expired_active_game_id"], [])
        self.worker.run()

        for game_config in self.config.ACTIVE_GAMES:
            self.worker.dao.get_oldest_pending_games.assert_called_with(
                game_config["product_id"], result_set_size=10
            )
            self.worker.dao.get_oldest_lobby_games.assert_called_with(
                game_config["product_id"], result_set_size=10
            )
            self.worker.dao.get_oldest_active_games.assert_called_with(
                game_config["product_id"], result_set_size=10
            )

            self.worker.purge_game_if_expired.assert_called_once_with(
                game_config["product_id"], "expired_active_game_id"
            )

    def _create_mocks(self, pending_game_ids, active_game_ids, lobby_game_ids):
        self.worker.dao.get_oldest_pending_games = MagicMock(
            return_value=pending_game_ids
        )
        self.worker.dao.get_oldest_lobby_games = MagicMock(return_value=lobby_game_ids)
        self.worker.dao.get_oldest_active_games = MagicMock(
            return_value=active_game_ids
        )
        self.worker.purge_game_if_expired = MagicMock()


@pytest.mark.usefixtures("test_games")
class TestGameCurationWorkerPurgeGame:
    def setup_method(self):
        self.worker = GameCurationWorker(get_config("test"))

    def teardown_method(self):
        self.worker.dao.db.flushdb()

    def test_purge_non_existant_game(self):
        assert (
            self.worker.purge_game_if_expired(
                self.test_game.product_id, "some_invalid_id"
            )
            is False
        )

    @patch("workers.game_management_workers.send_remove_game_request")
    def test_purge_expired_game(self, send_remove_game_request):
        self.test_game._last_updated = datetime.datetime.utcnow() - datetime.timedelta(
            days=10
        )
        self.worker.dao.create_game(self.test_game)

        assert (
            self.worker.dao.get_game_by_id(
                self.test_game.product_id, self.test_game.game_id
            )
            is not None
        )
        assert (
            self.worker.purge_game_if_expired(
                self.test_game.product_id, self.test_game.game_id
            )
            is True
        )
        assert (
            self.worker.dao.get_game_by_id(
                self.test_game.product_id, self.test_game.game_id
            )
            is None
        )
        send_remove_game_request.assert_called_once()

    def test_purge_non_expired_game(self):
        pass

    @patch("workers.game_management_workers.get_game_server_controller")
    @patch("workers.game_management_workers.send_remove_game_request")
    def test_purge_game_server_config_not_found(
        self, send_remove_game_request, mock_get_game_server_controller
    ):
        """It is possible to receive a remove request for a valid game that exists, but the game
        server config has been removed. This test covers that case.

        This shouldn't really happen, the flow would have to be something like:

        Create Game - Play Game - <Internal: Game server is removed> - Game is expired/ends
        """
        mocked_server_controller = MagicMock()
        mocked_server_controller.get_game_server.return_value = None
        mock_get_game_server_controller.return_value = mocked_server_controller

        self.test_game._last_updated = datetime.datetime.utcnow() - datetime.timedelta(
            days=10
        )
        self.worker.dao.create_game(self.test_game)

        # Assertion is still that this function returns true as the game data model is still removed
        # We need to also verify that the remote game server was NOT called, as we couldn't find the config
        assert (
            self.worker.purge_game_if_expired(
                self.test_game.product_id, self.test_game.game_id
            )
            is True
        )

        send_remove_game_request.assert_not_called()


@pytest.mark.usefixtures("dao_instance", "test_games")
class TestGameCurationWorkerIntegration:
    """An end to end test of the worker - no mocking"""

    def setup_method(self):
        self.worker = GameCurationWorker(get_config("test"))
        self.product_id = self.test_game.product_id
        game_template = self.test_game.to_dict()
        for i in range(10):
            if i % 2 == 0:
                # Expire half of our games
                game_template["_last_updated"] = (
                    datetime.datetime.utcnow() - datetime.timedelta(days=3)
                ).strftime("%d-%b-%Y (%H:%M:%S.%f)")
            else:
                game_template["_last_updated"] = datetime.datetime.utcnow().strftime(
                    "%d-%b-%Y (%H:%M:%S.%f)"
                )

            game_template["game_id"] = f"{self.test_game.game_id}_{str(i)}_pending"
            self.dao.create_game(Game.from_dict(game_template))

            game_template["game_id"] = f"{self.test_game.game_id}_{str(i)}_lobby"
            self.dao.create_game(Game.from_dict(game_template))
            self.dao.publish_game(Game.from_dict(game_template))

            game_template["game_id"] = f"{self.test_game.game_id}_{str(i)}_active"
            self.dao.create_game(Game.from_dict(game_template))
            self.dao.publish_game(Game.from_dict(game_template))
            self.dao.start_game(Game.from_dict(game_template))

        # Create one game that needs resetting
        game_template["game_id"] = "reset_game"
        game_template["_last_updated"] = (
            datetime.datetime.utcnow() - datetime.timedelta(days=3)
        ).strftime("%d-%b-%Y (%H:%M:%S.%f)")
        game_template["state"] = GameState.CREATOR_JOINED
        game_template["players"] = ["userA", "userB"]
        self.dao.create_game(Game.from_dict(game_template))
        self.dao.publish_game(Game.from_dict(game_template))

    def teardown_method(self):
        self.worker.dao.db.flushdb()

    @patch("workers.game_management_workers.send_remove_game_request")
    @patch("workers.game_management_workers.send_remove_player_request")
    def test_run_worker_with_some_expired_games(
        self, send_remove_game_request, send_remove_player_request
    ):
        # Make sure our creation went ok
        assert (
            len(
                list(
                    self.dao.get_oldest_active_games(
                        self.product_id, result_set_size=100
                    )
                )
            )
            == 10
        )
        assert (
            len(
                list(
                    self.dao.get_oldest_pending_games(
                        self.product_id, result_set_size=100
                    )
                )
            )
            == 10
        )
        assert (
            len(
                list(
                    self.dao.get_oldest_lobby_games(
                        self.product_id, result_set_size=100
                    )
                )
            )
            == 11
        )

        # This should clean up half of the games
        self.worker.run(batch_size=20)

        assert (
            len(
                list(
                    self.dao.get_oldest_active_games(
                        self.product_id, result_set_size=100
                    )
                )
            )
            == 5
        )
        assert (
            len(
                list(
                    self.dao.get_oldest_pending_games(
                        self.product_id, result_set_size=100
                    )
                )
            )
            == 5
        )
        print(
            list(self.dao.get_oldest_lobby_games(self.product_id, result_set_size=100))
        )
        assert (
            len(
                list(
                    self.dao.get_oldest_lobby_games(
                        self.product_id, result_set_size=100
                    )
                )
            )
            == 6
        )

        assert send_remove_player_request.called_once()
        assert send_remove_game_request.called_once()
