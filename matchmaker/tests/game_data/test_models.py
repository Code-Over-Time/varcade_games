import datetime

from unittest import mock

import pytest

from game_data.models import Game, GameState, UserProfile


class TestGameState:
    def test_state_transitions(self):
        for state, transition_state in GameState.STATE_TRANSITIONS.items():
            # Ensure no state transitions to itself
            assert state != transition_state

            # Verify the validation function
            assert GameState.is_valid_state_transition(state, transition_state)


class TestGameModel:
    def setup_method(self, mock_dt):
        self.now_timestamp = datetime.datetime.utcnow()

    def test_constructor_data_validation(self):
        """Ensure that the Game Model constructor properly validates inputs
        and raises a descriptive error in case of failure
        """
        with pytest.raises(ValueError, match=r".* game_id .*"):
            Game(None, None, None, None, None)
        with pytest.raises(ValueError, match=r".* product_id .*"):
            Game("abc", None, None, None, None)
        with pytest.raises(ValueError, match=r".* game_server_url .*"):
            Game("abc", "game1", None, None, None)
        with pytest.raises(ValueError, match=r".* creator_id .*"):
            Game("abc", "game1", "localhost", None, None)
        with pytest.raises(ValueError, match=r".* creator_name .*"):
            Game("abc", "game1", "localhost", "userid", None)

        Game("abc", "game1", "localhost", "userA", "userAname")  # The minimum we expect
        Game(
            "abc",
            "game1",
            "localhost",
            "userA",
            "userAname",
            num_players=2,
            time_limit=10,
        )  # Add some settings

    def test_add_player(self):
        game = Game("abc", "game1", "localhost", "userA", "userAname", num_players=2)
        assert game.players == ["userA"]

        with pytest.raises(ValueError, match=r".*already joined"):
            game.add_player("userA")

        game.add_player("userB")
        assert game.players == ["userA", "userB"]

        with pytest.raises(ValueError, match=r".*capacity already reached.*"):
            game.add_player("userC")

    def test_remove_player(self):
        game = Game("abc", "game1", "localhost", "userA", "userAname", num_players=2)
        game.add_player("userB")

        with pytest.raises(ValueError, match=r".*the creator cannot be removed.*"):
            game.remove_player("userA")

        with pytest.raises(ValueError, match=r".*not in the player list.*"):
            game.remove_player("userC")

        with pytest.raises(ValueError):
            game.remove_player(None)

        game.remove_player("userB")
        assert game.players == ["userA"]

    def test_reset_to_creator_joined(self):
        game = Game("abc", "game1", "localhost", "userA", "userAname", num_players=2)

        with pytest.raises(AttributeError):
            game.reset_to_creator_joined()

        game.state = (
            GameState.CREATOR_JOINED
        )  # Need to incrementally set state due to validation
        game.add_player("userB")
        game.state = GameState.ALL_PLAYERS_JOINED
        assert game.players == ["userA", "userB"]

        game.reset_to_creator_joined()
        assert game.players == ["userA"]
        assert game.state == GameState.CREATOR_JOINED

    @mock.patch("game_data.models.datetime")
    def test_to_dict(self, mocked_dt):
        mocked_dt.utcnow = mock.Mock(return_value=self.now_timestamp)
        mocked_dt.utcnow.strftime = mock.Mock(
            return_value=self._get_now_timestamp_str()
        )

        # Test the most basic version of the model - no settings upplied
        assert Game("abc", "game1", "localhost", "userA", "userAname").to_dict() == {
            "game_id": "abc",
            "product_id": "game1",
            "game_server_url": "localhost",
            "creator_id": "userA",
            "creator_name": "userAname",
            "players": ["userA"],
            "settings": {},
            "token": "",
            "state": "created",
            "_last_updated": self._get_now_timestamp_str(),
        }

        # Ensure settings are serialized
        assert Game(
            "abc",
            "game1",
            "localhost",
            "userA",
            "userAname",
            num_players=2,
            another_setting=10,
        ).to_dict() == {
            "game_id": "abc",
            "product_id": "game1",
            "game_server_url": "localhost",
            "creator_id": "userA",
            "creator_name": "userAname",
            "players": ["userA"],
            "settings": {"num_players": 2, "another_setting": 10},
            "token": "",
            "state": "created",
            "_last_updated": self._get_now_timestamp_str(),
        }

        # With settings and a player added to the game
        test_game = Game(
            "abc", "game1", "localhost", "userA", "userAname", num_players=2
        )
        assert test_game.to_dict() == {
            "game_id": "abc",
            "product_id": "game1",
            "game_server_url": "localhost",
            "creator_id": "userA",
            "creator_name": "userAname",
            "players": ["userA"],
            "settings": {"num_players": 2},
            "token": "",
            "state": "created",
            "_last_updated": self._get_now_timestamp_str(),
        }

    def test_from_dict_success(self):
        """Test parsing from a dict"""
        test_game = Game.from_dict(
            {
                "game_id": "abc",
                "product_id": "game1",
                "game_server_url": "localhost",
                "creator_id": "userA",
                "creator_name": "userAname",
                "players": ["userA", "userB"],
                "settings": {"num_players": 2},
                "token": "",
                "state": "created",
                "_last_updated": self._get_now_timestamp_str(),
            }
        )
        assert test_game.game_id == "abc"
        assert test_game.product_id == "game1"
        assert test_game.game_server_url == "localhost"
        assert test_game.creator_id == "userA"
        assert test_game.creator_name == "userAname"
        assert test_game.players == ["userA", "userB"]
        assert test_game.settings == {"num_players": 2}
        assert test_game.state == "created"
        assert test_game._last_updated == self.now_timestamp

    def test_from_dict_failure(self):
        # Missing game server URL
        with pytest.raises(ValueError, match=r".* game_server_url .*"):
            Game.from_dict({"game_id": "abc", "product_id": "game1"})

        # Load more players than allowed by settings
        with pytest.raises(ValueError, match=r".* too many players .*"):
            Game.from_dict(
                {
                    "game_id": "abc",
                    "product_id": "game1",
                    "game_server_url": "localhost",
                    "creator_id": "userA",
                    "creator_name": "userAname",
                    "players": ["userA", "userB", "userC"],
                    "settings": {"num_players": 2},
                    "state": "created",
                    "_last_updated": self._get_now_timestamp_str(),
                }
            )

        # The creator ID not found in player list
        with pytest.raises(
            ValueError, match=r".* creator is not in the players list.*"
        ):
            Game.from_dict(
                {
                    "game_id": "abc",
                    "product_id": "game1",
                    "game_server_url": "localhost",
                    "creator_id": "userA",
                    "creator_name": "userAname",
                    "players": ["userB", "userC"],
                    "settings": {"num_players": 2},
                    "state": "created",
                    "_last_updated": self._get_now_timestamp_str(),
                }
            )

        # Load invalid last updated timestamp
        with pytest.raises(ValueError, match=r"Invalid timestamp .*"):
            Game.from_dict(
                {
                    "game_id": "abc",
                    "product_id": "game1",
                    "game_server_url": "localhost",
                    "creator_id": "userA",
                    "creator_name": "userAname",
                    "players": ["userA", "userB", "userC"],
                    "settings": {"num_players": 2},
                    "state": "created",
                    "_last_updated": None,
                }
            )

    def test_serialization(self):
        test_game = Game(
            "abc", "game1", "localhost", "userA", "userAname", num_players=2
        )
        test_game._last_updated = self.now_timestamp

        output_string = test_game.serialize()
        assert output_string == (
            f'{{"game_id": "abc", "product_id": "game1", "game_server_url": "localhost", "creator_id": "userA", '
            f'"creator_name": "userAname", "players": ["userA"], "settings": {{"num_players": 2}}, "token": "", '
            f'"_last_updated": "{self._get_now_timestamp_str()}", '
            f'"state": "created"}}'
        )

        deserialized_game = Game.deserialize(output_string)
        assert deserialized_game.game_id == "abc"
        assert deserialized_game.game_server_url == "localhost"
        assert deserialized_game.creator_id == "userA"
        assert deserialized_game.creator_name == "userAname"
        assert deserialized_game.players == ["userA"]
        assert deserialized_game.settings == {"num_players": 2}

        assert Game.deserialize(None) is None

    def test_is_expired(self):
        test_game = Game(
            "abc", "game1", "localhost", "userA", "userAname", num_players=2
        )

        # Game was just created so it should not be expired
        assert test_game.is_expired is False

        with mock.patch("game_data.models.datetime") as mocked_dt:
            # Mock timestamp utcnow method to 'jump forward' in time to 1s after expiry
            mocked_dt.utcnow = mock.Mock(
                return_value=self.now_timestamp
                + datetime.timedelta(
                    seconds=GameState.STATE_EXPIRY[GameState.CREATED] + 1
                )
            )
            assert test_game.is_expired

            # Jump forward to 1s before expiry
            mocked_dt.utcnow = mock.Mock(
                return_value=self.now_timestamp
                + datetime.timedelta(
                    seconds=GameState.STATE_EXPIRY[GameState.CREATED] - 1
                )
            )
            assert test_game.is_expired is False

    def test_state_setter(self):
        """Ensure that updating the state implicitly updates the 'last updated' timestamp"""
        with mock.patch("game_data.models.datetime") as mocked_dt:
            mocked_dt.utcnow = mock.Mock(return_value=self.now_timestamp)

            test_game = Game(
                "abc", "game1", "localhost", "userA", "userAname", num_players=2
            )
            assert test_game._last_updated == self.now_timestamp

            # Check state value validation
            with pytest.raises(ValueError, match=r".* not a valid state.*"):
                test_game.state = 999

            # Just forward a few seconds in time, mocking utcnow()
            updated_timestmap = self.now_timestamp + datetime.timedelta(seconds=10)
            mocked_dt.utcnow = mock.Mock(return_value=updated_timestmap)
            test_game.state = GameState.CREATOR_JOINED
            assert test_game._last_updated != self.now_timestamp
            assert test_game._last_updated == updated_timestmap

    def test_at_capacity(self):
        test_game = Game(
            "abc", "game1", "localhost", "userA", "userAname", num_players=2
        )
        assert test_game.at_capacity == False
        test_game.add_player("userB")
        assert test_game.at_capacity == True

    def _get_now_timestamp_str(self):
        return self.now_timestamp.strftime("%d-%b-%Y (%H:%M:%S.%f)")
