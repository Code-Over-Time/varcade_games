from typing import List, Dict, Any

import logging

import json

from datetime import datetime, timedelta

from werkzeug.local import LocalProxy

from flask import current_app


class GameState:
    """GameState is for referencing game states and performing some basic
    validation around state transitions and expiry.
    """

    # The default state for a new game
    CREATED = "created"

    # The creator of the game has joined the game
    # on the actual game server. Other players can
    # now join.
    CREATOR_JOINED = "creator_joined"

    # All required players have now joined. This signifies
    # that the game can be started
    ALL_PLAYERS_JOINED = "all_players_joined"

    # The game is in progress - the duration will vary from
    # game to game
    IN_PROGRESS = "in_progress"

    # The game has ended
    ENDED = "ended"

    # All valid state transitions.
    STATE_TRANSITIONS = {
        CREATED: CREATOR_JOINED,
        CREATOR_JOINED: ALL_PLAYERS_JOINED,
        ALL_PLAYERS_JOINED: IN_PROGRESS,
        IN_PROGRESS: ENDED,
        ENDED: None,
    }

    # Track different expiry times for different states.
    # For example, we want a game in the 'ended' state to be cleaned up quickly
    # but the 'in progress' state should give enough time for the game to complete
    STATE_EXPIRY = {
        CREATED: 60,
        CREATOR_JOINED: 60,
        ALL_PLAYERS_JOINED: 600,
        IN_PROGRESS: 1200,
        ENDED: 300,
    }

    @staticmethod
    def is_valid_state_transition(current_state: str, new_state: str):
        return GameState.STATE_TRANSITIONS[current_state] == new_state


class UserProfile:
    def __init__(self, user_id: str, username: str):
        self.user_id = user_id
        self.username = username

    def __eq__(self, other) -> bool:
        return self.user_id == other.user_id and self.username == other.username


class Game:
    def __init__(
        self,
        game_id: str,
        product_id: str,
        game_server_url: str,
        creator_id: str,
        creator_name: str,
        **kwargs,
    ):
        """Create a new Game object that represents a multi-player session on a game server.

        :param game_id:             The ID of the game.
        :param product_id:          The product ID for this game - this refers to the game being played
        :param game_server_url:     The URL of the target game server for this game
        :param creator_id:          The ID of the user that started the game.
        :param creator_name:        The username of the user that started the game.
        :param kwargs:              Game settings. The contents of this dict will vary from game to game.
        """
        if game_id is None:
            raise ValueError("Could not create a Game - game_id cannot be None")
        if product_id is None:
            raise ValueError("Could not create a Game - product_id cannot be None")
        elif game_server_url is None:
            raise ValueError("Could not create a Game - game_server_url cannot be None")
        elif creator_id is None:
            raise ValueError("Could not create a Game - creator_id cannot be None")
        elif creator_name is None:
            raise ValueError("Could not create a Game - creator_name cannot be None")

        self.game_id = game_id
        self.product_id = product_id
        self.creator_id = creator_id
        self.creator_name = creator_name
        self.game_server_url = game_server_url

        self._state: str = GameState.CREATED
        self._num_players = 2
        self._last_updated: datetime = datetime.utcnow()
        self.players: List[str] = []
        self.settings = {}
        self.settings.update(kwargs)

        # This will get populated once we create an actual game on the game server
        self.token: str = ""

        # Go ahead and add the creator
        self.add_player(self.creator_id)

    def add_player(self, player_id: str) -> None:
        """Adds a player to the given Game

        :raise ValueError:  If the player capacity for this game has already been reached
        :raise ValueError:  If the player being added is already in the players list
        """
        if self.at_capacity:
            raise ValueError(
                f"Unable to add player {player_id} to the game - capacity already reached."
            )
        if player_id in self.players:
            raise ValueError(
                f"Unable to add player {player_id} to the game - they have already joined."
            )

        self.players.append(player_id)
        self._last_updated = datetime.utcnow()

    def remove_player(self, player_id: str) -> None:
        if not player_id:
            raise ValueError(f"Unable to remove player_id 'None' from a game.")

        if player_id == self.creator_id:
            raise ValueError(
                f"Unable to remove player {player_id} from the game - the creator cannot be removed."
            )

        if player_id not in self.players:
            raise ValueError(
                f"Unable to remove player {player_id} from the game - they are not in the player list."
            )
        self.state = GameState.CREATOR_JOINED
        self.players.remove(player_id)
        self._last_updated = datetime.utcnow()

    def reset_to_creator_joined(self):
        """In multiple error scenarios a game may want to reset back to
        it's initial state after the creator joined.
        """
        if self.state == GameState.CREATED:
            raise AttributeError(
                "Unable to reset game state to CREATOR_JOINED, that state has not been reached yet."
            )
        self._state = GameState.CREATOR_JOINED
        self._last_updated = datetime.utcnow()
        if len(self.players) == self._num_players:
            return self.players.pop()
        return None

    @property
    def at_capacity(self) -> bool:
        """A property that returns whether or not the given game is currently at capacity,
        ie. the max number of players has been reached.

        :returns bool:    True if the max number of players has been reached, false otherwise
        """
        return len(self.players) == self._num_players

    @property
    def state(self) -> str:
        """Property representing the current state of the game, as defined in
        the GameStates class.

        :returns int:    The current state of the game
        """
        return self._state

    @state.setter
    def state(self, value: str) -> None:
        """Set the current state of the game. This implicitly updates the 'last updated' timestamp,
        meaning that state updates will affect the game expiry process.

        :param value:       An string representing the new state of the game. Must be a valid
                            GameState value
        :raises ValueError: If the value is not a valid state
        """
        if value not in GameState.STATE_TRANSITIONS:
            raise ValueError(
                f"Cannot set game state to {value}, it is not a valid state."
            )
        self._state = value
        self._last_updated = datetime.utcnow()

    @property
    def needs_reset(self) -> bool:
        """If a game expires in a certain state, we may want to reset it.
            For example if player 2 joins a 2 player game but never connects
            to the game server, we will want to republish the game to the
            lobby so that someone else can join and P1 isn't left waiting
            forever.

        :returns bool:  True is the game should be reset, false otherwise
        """
        # Creator has joined, meaning the game is published.
        return (
            self._state == GameState.CREATOR_JOINED
            and self.at_capacity
            and self.is_expired
        )

    @property
    def is_expired(self) -> bool:
        """A game is considered expired if it has spent a certain amount of time
        in a given state. Each state has a timeout, defined in the GameState class.

        This property will compare the last updated time + state expiry time against
        the current time.

        :returns bool:  True if the game is expired, false otherwise.
        """
        return (
            self._last_updated + timedelta(seconds=GameState.STATE_EXPIRY[self._state])
        ) < datetime.utcnow()

    def to_dict(self, partial=False) -> Dict[str, Any]:
        """Create a dictionary representation of the Game object

        Parameters:
        partial(bool):  True if the output dict should remove sensitive information,
                        currently includes: token

        returns dict: A dictionary representing the game object.
        """
        game_data = {
            "game_id": self.game_id,
            "product_id": self.product_id,
            "game_server_url": self.game_server_url,
            "creator_id": self.creator_id,
            "creator_name": self.creator_name,
            "players": self.players,
            "settings": self.settings,
        }

        if not partial:
            game_data.update(
                {
                    "token": self.token,
                    "_last_updated": self._last_updated.strftime(
                        "%d-%b-%Y (%H:%M:%S.%f)"
                    ),
                    "state": self._state,
                }
            )

        return game_data

    @staticmethod
    def from_dict(game_dict: Dict[str, Any]) -> "Game":
        """Creates a Game object instance from the data in a dictionary.

        All required fields in the constructor are required to be present in the dict.

        raises ValueError:  If there are more players specified in a players list than allowed in the game
        raises ValueError:  If the game creator is not in the players list

        return Game:    A instance of a Game object
        """
        # Create our Game object
        game_data = Game(
            game_dict.get("game_id", None),
            game_dict.get("product_id", None),
            game_dict.get("game_server_url", None),
            game_dict.get("creator_id", None),
            game_dict.get("creator_name", None),
            **game_dict.get("settings", {}),
        )

        # Add our private member variables and parse last updated timestamp
        game_data.token = game_dict.get("token", None)
        game_data._state = game_dict.get("state", None)

        last_update_timestamp = game_dict.get("_last_updated", None)
        if last_update_timestamp is None:
            raise ValueError(
                f"Invalid timestamp found while load game dict: {game_dict}"
            )

        game_data._last_updated = datetime.strptime(
            last_update_timestamp, "%d-%b-%Y (%H:%M:%S.%f)"
        )

        # The Game constructor will create a player list for us by default.
        # We need to check for a player list in the dict and make sure it is valid before overwriting.
        players_list = game_dict.get("players", None)
        if players_list:
            if game_data.creator_id not in players_list:
                raise ValueError(
                    f"Unable to create Game from dict {game_dict} \
                                 - the game creator is not in the players list."
                )
            elif len(players_list) > game_data._num_players:
                raise ValueError(
                    f"Unable to create Game from dict {game_dict} - \
                                 too many players specified"
                )
            game_data.players = players_list

        return game_data

    def serialize(self) -> str:
        """Create a string representation of the Game model.

        return str: A JSON dump of the game object
        """
        return json.dumps(self.to_dict())

    @staticmethod
    def deserialize(string_data: str) -> "Game":
        """Create a Game object from a JSON string representation

        return Game: A Game object loaded from a JSON string
        """
        if string_data is None:
            return None
        return Game.from_dict(json.loads(string_data))

    def __repr__(self) -> str:
        return f"Game({self.game_id}, {self.product_id}, {self.game_server_url}, {self.creator_id}"
