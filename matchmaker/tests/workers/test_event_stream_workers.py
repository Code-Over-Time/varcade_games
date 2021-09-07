import datetime

from unittest.mock import patch, MagicMock, call

import pytest

from game_data.dao import initialise_db

from game_data.models import Game, GameState

from workers.event_stream_workers import EventStreamWorker, GameEventWorker


class TestEventStreamWorkerFlowWithMocks:
    """Event stream worker is an 'abstract' class. This test is just to verify
    that events are properly read and handed off to the subclass implementations

    Note: This test requires Redis to run, even though it is not used.
    The EventStreamWorker constructor will initialize a Redis object by default.
    """

    def setup_method(self):
        self.db_url = "redis://localhost:6379/0"
        self.stream_id = "test_stream"
        self.stream_index_key = "_index"
        self.worker = EventStreamWorker(
            self.db_url, self.stream_id, self.stream_index_key
        )

    def teardown_method(self):
        self.worker._event_stream.flushdb()

    def test_run_no_events_in_stream(self):
        self.worker.process_events = MagicMock(return_value=None)
        self.worker.run()
        self.worker.process_events.assert_not_called()

    def test_abstract_methods(self):
        with pytest.raises(NotImplementedError):
            self.worker.process_events([])

    def test_run_events_in_stream(self):
        self.worker.process_events = MagicMock(return_value=("new_stream_index", 1))

        new_event_id = self.worker._event_stream.xadd(
            self.stream_id,
            {
                "product_id": "test_product_id",
                "game_id": "test_game_id",
                "type": "state_change",
                "new_state": 1,
            },
        )

        self.worker.run()
        self.worker.process_events.assert_called_once_with(
            [
                [
                    b"test_stream",
                    [
                        (
                            new_event_id,
                            {
                                b"product_id": b"test_product_id",
                                b"game_id": b"test_game_id",
                                b"type": b"state_change",
                                b"new_state": b"1",
                            },
                        )
                    ],
                ]
            ]
        )


@pytest.mark.usefixtures("test_games")
class TestGameEventWorkerWithMocks:
    def setup_method(self):
        db_url = "redis://localhost:6379/0"
        self.worker = GameEventWorker(db_url)

    def teardown_method(self):
        self.worker._event_stream.flushdb()

    def test_override_methods(self):
        assert self.worker.get_name() == "Game event worker"

    def test_process_event_flow_with_mocks(self, sample_game_event_stream_events):
        self.worker.update_game_state = MagicMock(return_value=None)
        # Ensure that we are returned the stream index for the LAST event (see fixture in conftest.py)
        assert self.worker.process_events(sample_game_event_stream_events) == (
            b"last_event_index",
            2,
        )
        self.worker.update_game_state.assert_has_calls(
            [
                call("test_product_id", "test_game_id", "1"),
                call("test_product_id", "test_game_id", "2"),
            ]
        )

    def test_process_events_flow_unknown_event_type_with_mocks(
        self, sample_game_event_stream_events
    ):
        self.worker.update_game_state = MagicMock(return_value=None)

        # Replace the type of one of the events with an unknown type. Here we are replacing
        # the last event type as we want it to be skipped but we still want to update to that
        # stream index
        sample_game_event_stream_events[0][1][1][1][b"type"] = "unknown_type"

        # This call should still be successful, but one of the events should not be processed
        assert self.worker.process_events(sample_game_event_stream_events) == (
            b"last_event_index",
            1,
        )
        # Only get one call in this case - one of the events has an unknown type
        self.worker.update_game_state.assert_has_calls(
            [call("test_product_id", "test_game_id", "1")]
        )

    @patch("workers.event_stream_workers.GameTransaction")
    def test_update_game_state_game_not_found_with_mocks(
        self, mocked_transaction, valid_product_id
    ):
        mock_dao = MagicMock()
        mocked_transaction.return_value.__enter__.return_value = (mock_dao, None)

        # It's possible that a game was expired just before an event was received, in this case
        # we just expect a False return value
        assert (
            self.worker.update_game_state(valid_product_id, "invalid_game_id", 0)
            is False
        )

    @patch("workers.event_stream_workers.GameTransaction")
    def test_update_game_state_invalid_transition_with_mocks(self, mocked_transaction):
        mock_dao = MagicMock()
        mock_dao.update_game = MagicMock(return_value=None)
        mocked_transaction.return_value.__enter__.return_value = (
            mock_dao,
            self.test_game,
        )

        # Updating to state 2 should fail as state 0->2 is not a valid transition
        assert (
            self.worker.update_game_state(
                self.test_game.product_id,
                self.test_game.game_id,
                GameState.ALL_PLAYERS_JOINED,
            )
            is False
        )
        mock_dao.update_game.assert_not_called()

    @patch("workers.event_stream_workers.GameTransaction")
    def test_update_game_state_simple_transition(self, mocked_transaction):
        mock_dao = MagicMock()
        mock_dao.update_game = MagicMock(return_value=None)
        mock_dao.start_game = MagicMock(return_value=None)
        mock_dao.publish_game = MagicMock(return_value=None)

        self.test_game.state = GameState.ALL_PLAYERS_JOINED

        mocked_transaction.return_value.__enter__.return_value = (
            mock_dao,
            self.test_game,
        )

        # Updating to state 2 should fail as state 0->2 is not a valid transition
        assert (
            self.worker.update_game_state(
                self.test_game.product_id, self.test_game.game_id, GameState.IN_PROGRESS
            )
            is True
        )
        mock_dao.update_game.assert_called_once()
        mock_dao.start_game.assert_not_called()
        mock_dao.publish_game.assert_not_called()

    @patch("workers.event_stream_workers.GameTransaction")
    def test_update_game_state_and_activate(self, mocked_transaction):
        """In this case we receive an event that updates the state AND activates the game"""
        mock_dao = MagicMock()
        mock_dao.update_game = MagicMock(return_value=None)
        mock_dao.start_game = MagicMock(return_value=None)
        mock_dao.publish_game = MagicMock(return_value=None)

        mocked_transaction.return_value.__enter__.return_value = (
            mock_dao,
            self.test_game,
        )

        self.test_game.state = GameState.CREATED

        assert (
            self.worker.update_game_state(
                self.test_game.product_id,
                self.test_game.game_id,
                GameState.CREATOR_JOINED,
            )
            is True
        )
        mock_dao.update_game.assert_called_once()
        mock_dao.publish_game.assert_called_once()
        mock_dao.start_game.assert_not_called()

    @patch("workers.event_stream_workers.GameTransaction")
    def test_update_game_state_and_start(self, mocked_transaction):
        mock_dao = MagicMock()
        mock_dao.update_game = MagicMock(return_value=None)
        mock_dao.start_game = MagicMock(return_value=None)
        mock_dao.publish_game = MagicMock(return_value=None)

        self.test_game.state = GameState.CREATOR_JOINED

        mocked_transaction.return_value.__enter__.return_value = (
            mock_dao,
            self.test_game,
        )

        assert (
            self.worker.update_game_state(
                self.test_game.product_id,
                self.test_game.game_id,
                GameState.ALL_PLAYERS_JOINED,
            )
            is True
        )
        mock_dao.update_game.assert_called_once()
        mock_dao.publish_game.assert_not_called()

    @patch("workers.event_stream_workers.GameTransaction")
    def test_remove_game_on_event(self, mocked_transaction):
        mock_dao = MagicMock()
        mock_dao.remove_game = MagicMock(return_value=None)

        mocked_transaction.return_value.__enter__.return_value = (
            mock_dao,
            self.test_game,
        )

        self.worker.handle_game_removal(
            self.test_game.product_id, self.test_game.game_id
        )
        mock_dao.delete_game.assert_called_once()


@pytest.mark.usefixtures("dao_instance", "test_games")
class TestGameEventWorkerIntegration:
    def setup_method(self):
        db_url = "redis://localhost:6379/0"
        self.worker = GameEventWorker(db_url)
        initialise_db(db_url, db_url)

    def teardown_method(self):
        self.worker._event_stream.flushdb()

    def test_update_state_an_activate(self):
        self.dao.create_game(self.test_game)
        self.assert_game_set_sizes(1, 0, 0)

        new_event_id = self.worker._event_stream.xadd(
            self.worker._stream_id,
            {
                "product_id": self.test_game.product_id,
                "game_id": self.test_game.game_id,
                "type": "state_change",
                "new_state": GameState.CREATOR_JOINED,
            },
        )

        self.worker.run()
        self.assert_game_set_sizes(0, 1, 0)
        assert (
            self.dao.get_game_by_id(
                self.test_game.product_id, self.test_game.game_id
            ).state
            == GameState.CREATOR_JOINED
        )

    def test_update_state_and_start_game(self):
        self.dao.create_game(self.test_game)
        self.test_game.state = GameState.CREATOR_JOINED
        self.dao.publish_game(self.test_game)
        self.assert_game_set_sizes(0, 1, 0)

        new_event_id = self.worker._event_stream.xadd(
            self.worker._stream_id,
            {
                "product_id": self.test_game.product_id,
                "game_id": self.test_game.game_id,
                "type": "state_change",
                "new_state": GameState.ALL_PLAYERS_JOINED,
            },
        )

        self.worker.run()
        self.assert_game_set_sizes(0, 1, 0)
        assert (
            self.dao.get_game_by_id(
                self.test_game.product_id, self.test_game.game_id
            ).state
            == GameState.ALL_PLAYERS_JOINED
        )

    def test_update_state_only(self):
        self.dao.create_game(self.test_game)
        self.test_game.state = GameState.IN_PROGRESS
        self.dao.publish_game(self.test_game)
        self.dao.start_game(self.test_game)

        self.assert_game_set_sizes(0, 0, 1)
        new_event_id = self.worker._event_stream.xadd(
            self.worker._stream_id,
            {
                "product_id": self.test_game.product_id,
                "game_id": self.test_game.game_id,
                "type": "state_change",
                "new_state": GameState.ENDED,
            },
        )

        self.worker.run()
        self.assert_game_set_sizes(0, 0, 1)
        assert (
            self.dao.get_game_by_id(
                self.test_game.product_id, self.test_game.game_id
            ).state
            == GameState.ENDED
        )

    def test_remove_game_only(self):
        self.dao.create_game(self.test_game)
        self.dao.publish_game(self.test_game)

        self.assert_game_set_sizes(0, 1, 0)
        new_event_id = self.worker._event_stream.xadd(
            self.worker._stream_id,
            {
                "product_id": self.test_game.product_id,
                "game_id": self.test_game.game_id,
                "type": "game_removed",
            },
        )
        self.worker.run()
        self.assert_game_set_sizes(0, 0, 0)
        assert (
            self.dao.get_game_by_id(self.test_game.product_id, self.test_game.game_id)
            is None
        )

    def test_player_disconnect(self):
        self.dao.create_game(self.test_game)
        self.test_game.state = GameState.IN_PROGRESS
        self.dao.publish_game(self.test_game)
        self.test_game.add_player("userB")
        self.dao.start_game(self.test_game)

        self.assert_game_set_sizes(0, 0, 1)
        new_event_id = self.worker._event_stream.xadd(
            self.worker._stream_id,
            {
                "product_id": self.test_game.product_id,
                "game_id": self.test_game.game_id,
                "type": "player_disconnect",
                "player_id": "userB",
            },
        )
        self.worker.run()
        self.assert_game_set_sizes(0, 1, 0)
        game = self.dao.get_game_by_id(
            self.test_game.product_id, self.test_game.game_id
        )
        assert game.state == GameState.CREATOR_JOINED
        assert game.players == ["userA"]

    def assert_game_set_sizes(self, pending, lobby, active):
        assert (
            len(list(self.dao.get_oldest_pending_games(self.test_game.product_id)))
            == pending
        )
        assert (
            len(list(self.dao.get_oldest_active_games(self.test_game.product_id)))
            == active
        )
        assert (
            len(list(self.dao.get_oldest_lobby_games(self.test_game.product_id)))
            == lobby
        )
