from typing import Dict, Optional, Any, List

_game_server_controller = None


class GameServer:
    def __init__(self, game_server_config: Dict):
        """Represents a remote Game Server that the matchmaker can create/remove games on.

        Required config entries:

            * product_id: The id of the product being registered with the matchmaker
            * game_server_url: The URL of the game server - for matchmaker communication
            * game_socket_url: The URL of the socket that the player will connect to

        Optional config entries:

            * settings: optional storage for any game specific settings

        :param dict game_server_config:     The configuration of the game server.

        :return:    A dict containing the 'token' for the game that was created
        :rtype: dict
        :raises GameServerNetworkError: If the response from the remote game server is not a 200
        """
        try:
            self.product_id = game_server_config["product_id"]
            self.game_server_url = game_server_config["game_server_url"]
            self.game_socket_url = game_server_config["game_socket_url"]
            self.settings = game_server_config.get("settings", {})
        except KeyError as e:
            raise GameServerConfigError(
                f"Unable to create game server object, required configuration key missing."
                f"Error Message: {str(e)}. Config: {game_server_config}"
            )


class GameServerController:
    def __init__(self, active_products: List[Dict]):
        """A simple interface for managing and fetch game server configurations

        :param list active_products:    A list of game server configurations. See GameServer class.

        :raises GameServerConfigError:  if active_games is null or empty
        """
        self.game_server_map = {
            gs["product_id"]: GameServer(gs) for gs in active_products
        }

    def get_game_server(self, product_id: str) -> Optional[GameServer]:
        """A simple interface for managing and fetch game server configurations for registered products

        :param str product_id:    The ID of the product to fetch the game server for

        :return: a GameServer object, or None if a game server does not exist for the given product id
        :rtype: matchmaker.core.GameServer
        """
        return self.game_server_map.get(product_id, None)


class GameServerError(Exception):
    def __init__(self, message: str):
        super().__init__(message)


class GameServerConfigError(GameServerError):
    pass


def initialise(active_games: List[Dict]):
    """Creates a global GameServerController instance.

    :param list active_games:       A list of game server configurations. See GameServer class.

    :raises GameServerConfigError:  if active_games is null or empty
    """
    global _game_server_controller
    if not active_games:
        raise GameServerConfigError(
            "Unable to initialize game server controller. ACTIVE_GAMES entry missing."
        )
    _game_server_controller = GameServerController(active_games)


def get_game_server_controller() -> GameServerController:
    """Creates a global GameServerController instance.

    :return:  the global GameServerController instance
    :rtype: matchmaker.core.GameServerController
    :raises Exception: if initialize() is not called before calling this function
    """
    global _game_server_controller
    if _game_server_controller is None:
        raise Exception(
            "Initialize must be called before attempting to access the game server controller"
        )
    return _game_server_controller
