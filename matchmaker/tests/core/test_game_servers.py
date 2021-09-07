import time

import pytest

from core import game_servers as game_server_manager
from core.game_servers import GameServerConfigError, GameServer


@pytest.mark.usefixtures("test_game_server_config")
class TestGameServerControllerInitialisation:
    def setup_method(self):
        game_server_manager._game_server_controller = None

    def test_initialise_game_server_controller_success(self):
        assert game_server_manager._game_server_controller is None

        with pytest.raises(Exception, match=r"Initialize must be called .*"):
            game_server_manager.get_game_server_controller()

        game_server_manager.initialise(self.test_game_server_config)
        assert game_server_manager._game_server_controller is not None

        game_server_controller = game_server_manager.get_game_server_controller()
        assert game_server_controller is not None

        assert game_server_manager._game_server_controller

    def test_initialise_game_server_controller_invalid_config(self):
        assert game_server_manager._game_server_controller is None

        # 'ACTIVE_SERVER' must at least exist
        with pytest.raises(
            GameServerConfigError, match=r".* ACTIVE_GAMES entry missing."
        ):
            game_server_manager.initialise({})

        # Game server missing required keys
        # Will test all permutations of this in dedicated GameServerController test
        with pytest.raises(
            GameServerConfigError, match=r".* required configuration key missing.*"
        ):
            game_server_manager.initialise([{"product_id": "exrps"}])


class TestGameServer:
    def test_constructor_validation(self):
        with pytest.raises(
            GameServerConfigError, match=r".* required configuration key missing.*"
        ):
            GameServer({})

        gs = GameServer(
            {
                "product_id": "abc123",
                "game_server_url": "localhost",
                "game_socket_url": "locahost",
            }
        )

        assert gs.product_id == "abc123"
        assert gs.game_server_url == "localhost"
        assert gs.settings == {}

        gs = GameServer(
            {
                "product_id": "abc123",
                "game_server_url": "localhost",
                "game_socket_url": "locahost",
                "settings": {"settingA": "A"},
            }
        )
        assert gs.settings == {"settingA": "A"}
