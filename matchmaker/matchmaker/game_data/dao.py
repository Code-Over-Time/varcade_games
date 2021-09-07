import logging
import time

import redis
from redis import WatchError

from game_data.models import Game

from werkzeug.local import LocalProxy

from flask import current_app

game_dao = None
game_cache = None


def initialise_db(db_url: str, cache_url: str):
    """Connect to our Redis DB and create an instance of our Game DAO, to be
    stored and referenced at the module level.
    """
    logging.info(f"DAO: Initialising DB: {db_url} and Cache: {cache_url}.")
    global game_dao, game_cache
    db = redis.from_url(db_url)
    game_cache = redis.from_url(cache_url)
    game_dao = GameDao(db)


def get_game_dao():
    """Returns the current active instance of the GameDao.

    :returns GameDao:   The current active DAO is available.
    :raises Exception:  If this function is called before initialise_db has been called.
    """
    global game_dao
    if game_dao is None:
        raise Exception(
            "Game DAO has not been initialised, have you called 'initialise_db'."
        )
    return game_dao


def get_game_cache():
    global game_cache
    if game_cache is None:
        raise Exception(
            "The game cache has not been initialised, have you called 'initialise_db'."
        )
    return game_cache


class GameDao:
    """A basic DAO for creating and accessing game objects.

    This class functions as a wrapper around the Redis connection
    for and does not perform validation of data.

    It assumes that any Game objects passed as parameters will take
    care of data integrity - the DB simply serializes any given DB
    objects and saves them to the DB
    """

    def __init__(self, db):
        """Create a new Game Data Access Object that provides CRUD access
            to matchmaker data.

        db redis.Redis      A Redis instance
        """
        self.db = db

    def get_game_by_id(self, product_id, game_id):
        """Fetch a game from the DB by ID

        returns Game:   A Game object if a game for the given ID exists, None otherwise
        """
        game_data = self.db.hget(self._get_game_hash_key(product_id), game_id)
        if game_data:
            return Game.deserialize(game_data)

        return None

    def create_game(self, game):
        """Writes the given Game object to the DB.

            This operation will result in multiple writes to the DB.

            The Game will be serialized and stored in the relevant Hash for that product ID.

            The game ID will then be written to a Redis sorted set, using a timestamp for
            the score value. This set is our 'pending' set and allows us to fetch any newly
            created games sorting by creation date.

        raises ValueError:  If a game with the same ID already exists
        """
        if self.db.hexists(self._get_game_hash_key(game.product_id), game.game_id):
            raise ValueError(
                "Unable to create game - "
                "a game with the id {game.game_id} already exists"
            )
        pipeline = self.db.pipeline(transaction=True)
        pipeline.hset(
            self._get_game_hash_key(game.product_id), game.game_id, game.serialize()
        )
        pipeline.zadd(
            self._get_pending_games_set_key(game.product_id),
            {game.game_id: int(time.time())},
            nx=True,
        )
        # Add a key per game that we can use as a 'lock' to watch on during transactions
        pipeline.set(self._get_lock_key(game.game_id), game.product_id)
        pipeline.execute()
        return game

    def update_game(self, game):
        """Update an existing game in the DB.

        Serializes the Game object and overwrites any existing record entirely.

        returns game_data.Game:     Returns the game instance that was updated
        """
        self.db.set(self._get_lock_key(game.game_id), game.product_id)
        self.db.hset(
            self._get_game_hash_key(game.product_id), game.game_id, game.serialize()
        )
        return game

    def publish_game(self, game: Game):
        """Adds a game to the 'lobby set'.

        This means it will be available in searches for open games.

        returns game_data.Game:     Returns the game instance that was updated
        """
        self.db.set(self._get_lock_key(game.game_id), game.product_id)
        # Update the game record
        self.db.hset(
            self._get_game_hash_key(game.product_id), game.game_id, game.serialize()
        )
        # Remove from the pending set
        self.db.zrem(self._get_pending_games_set_key(game.product_id), game.game_id)
        # Add to the lobby set
        self.db.zadd(
            self._get_lobby_games_set_key(game.product_id),
            {game.game_id: int(time.time())},
            nx=True,
        )
        return game

    def start_game(self, game: Game):
        """Adds a game to the 'active set'.

        This means it will no longer be available in searches for open games.

        From this point on the game is played out on the game server and no longer open to join.

        returns game_data.Game:     Returns the game instance that was updated
        """
        # Update the game record
        self.db.set(self._get_lock_key(game.game_id), game.product_id)
        self.db.hset(
            self._get_game_hash_key(game.product_id), game.game_id, game.serialize()
        )
        # Remove from the pending set
        self.db.zrem(self._get_lobby_games_set_key(game.product_id), game.game_id)
        # Add to the lobby set
        self.db.zadd(
            self._get_active_games_set_key(game.product_id),
            {game.game_id: int(time.time())},
            nx=True,
        )
        return game

    def reset_game(self, game: Game):
        """Resets a game from being started back to being active.

        If a game starts but a player other than the creator leaves,
        the game can be reset back to active so the player can rejoin or
        a new player can join.

        After this method is called the game will be relisted in the lobby.
        """
        self.db.zrem(self._get_active_games_set_key(game.product_id), game.game_id)
        self.publish_game(game)

    def delete_game(self, product_id: str, game_id: str):
        """Delete the game with the given ID from the DB. This will also delete
        any entries from the lobby set, pending set and active game set.
        """
        self.db.delete(self._get_lock_key(game_id))
        self.db.zrem(self._get_lobby_games_set_key(product_id), game_id)
        self.db.zrem(self._get_pending_games_set_key(product_id), game_id)
        self.db.zrem(self._get_active_games_set_key(product_id), game_id)
        self.db.hdel(self._get_game_hash_key(product_id), game_id)

    def get_available_games(self, product_id: str, page_index: int, count: int):
        """Fetch a group of games that are available to join for a specific product ID.

        product_id  string:     The ID of the product
        page_index  int:        The page offset to fetch (pagination)
        count       int:        The number of entries to fetch per page

        return list:            Returns a list of game objects.
        """
        available_game_ids = self.db.zrange(
            self._get_lobby_games_set_key(product_id),
            page_index * count,
            (page_index * count) + count - 1,
        )

        if not available_game_ids:
            # We need to check this case explicitly, Redis will return an
            # error if we pass and empty list to hmget
            return {}

        game_hash_id = self._get_game_hash_key(product_id)
        return [
            game
            for game in [
                Game.deserialize(g)
                for g in self.db.hmget(game_hash_id, available_game_ids)
            ]
        ]

    def get_oldest_pending_games(self, product_id, result_set_size=10):
        """Fetch a list of the oldest games currently in the pending set.

        :param product_id:          The ID of the product to fetch pending games for
        :param result_set_size:     The maximum number of results to return
        :return:                    A list of Game IDs
        """
        return (
            s.decode("utf-8")
            for s in self.db.zrange(
                self._get_pending_games_set_key(product_id), -result_set_size, -1
            )
        )

    def get_oldest_lobby_games(self, product_id, result_set_size=10):
        """Fetch a list of the oldest games currently in the pending set.

        :param product_id:          The ID of the product to fetch pending games for
        :param result_set_size:     The maximum number of results to return
        :return:                    A list of Game IDs
        """
        return (
            s.decode("utf-8")
            for s in self.db.zrange(
                self._get_lobby_games_set_key(product_id), -result_set_size, -1
            )
        )

    def get_oldest_active_games(self, product_id, result_set_size=10):
        """Fetch a list of the oldest games currently in the pending set.

        :param product_id:          The ID of the product to fetch pending games for
        :param result_set_size:     The maximum number of results to return
        :return:                    A list of Game IDs
        """
        return (
            s.decode("utf-8")
            for s in self.db.zrange(
                self._get_active_games_set_key(product_id), -result_set_size, -1
            )
        )

    def _get_lock_key(self, game_id: str):
        """Individual hashset entries cannot be 'watched' before being modified, so a standardised
        key can be generated here to watch a specific hashset entry.

        :return:    Returns a string that can be used as a key to lock an individual game in the game hash
                    during a transaction
        """
        return f"wlock:{game_id}"

    def _get_game_hash_key(self, product_id: str):
        """Get the key of the hash that stores all available games for the given product ID

        return string:  The key that references a redis HashSet for the given product ID
        """
        return f"__games:{product_id}"

    def _get_pending_games_set_key(self, product_id: str):
        """Get the key of the set that stores the IDs of all pending games
            for the given product ID.

            Pending means that the game has been created but the creater has not yet joined.

        return string:  The key that references a redis SortedSet for the given product ID
        """
        return f"__pending_games:{product_id}"

    def _get_lobby_games_set_key(self, product_id: str):
        """Get the key of the set that stores the IDs of all games that are available to join
            for the given product ID

        return string:  The key that references a redis SortedSet for the given product ID
        """
        return f"__lobby_games:{product_id}"

    def _get_active_games_set_key(self, product_id: str):
        """Get the key of the set that stores the IDs of all active in progress games
            for the given product ID

        return string:  The key that references a redis SortedSet for the given product ID
        """
        return f"__active_games:{product_id}"


class GameTransaction(GameDao):
    def __init__(self, product_id: str, game_id: str):
        self.main_dao = get_game_dao()
        super().__init__(self.main_dao.db.pipeline(transaction=True))
        self.active_game = self.main_dao.get_game_by_id(product_id, game_id)
        self.db.watch(self._get_lock_key(game_id))
        self.db.multi()

    def get_game_by_id(self, product_id: str, game_id: str):
        raise NotImplementedError(
            "Cannot get game by ID in transactional DAO mode. Injected game must be used."
        )

    def create_game(self, game: Game):
        raise NotImplementedError("Cannot create game in transactional DAO mode")

    def execute_transaction(self):
        if self.active_game is not None:
            try:
                self.db.execute()
            except WatchError:
                logging.debug(
                    "A watch error occurred while executing Transactional Game DAO operation."
                )
                raise DaoTransactionError()

    def __enter__(self):
        return self, self.active_game

    def __exit__(self, type, value, traceback):
        self.execute_transaction()


class DaoTransactionError(Exception):
    pass
