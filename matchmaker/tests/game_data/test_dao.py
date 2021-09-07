import time

import pytest

import redis

from game_data.dao import (
    GameDao,
    initialise_db,
    get_game_dao,
    GameTransaction,
    DaoTransactionError,
    get_game_cache,
)
from game_data.models import Game, GameState


class TestDaoInit:
    def test_initialise_and_get_dao_and_cache(self):
        with pytest.raises(Exception, match=r".* DAO has not been initialised.*"):
            get_game_dao()

        with pytest.raises(Exception, match=r".* cache has not been initialised.*"):
            get_game_cache()

        initialise_db("redis://localhost:6379/0", "redis://localhost:6379/3")
        assert get_game_dao() is not None
        assert get_game_cache() is not None


@pytest.mark.usefixtures("dao_instance", "test_games")
class TestGameModelDao:
    def setup_method(self):
        self.redis_instance.flushdb()

    def test_get_game_by_id(self):
        assert self.dao.get_game_by_id("rps", "game_does_not_exist") is None
        self.dao.create_game(self.test_game)
        assert self.dao.get_game_by_id("exrps", self.test_game.game_id) is not None

    def test_create_game(self):
        self.dao.create_game(self.test_game)
        saved_game = self.dao.get_game_by_id(
            self.test_game.product_id, self.test_game.game_id
        )
        assert saved_game is not None
        assert saved_game.serialize() == self.test_game.serialize()

        # If we try to recreate the same game the DAO should error out
        with pytest.raises(ValueError, match=r".* already exists.*"):
            self.dao.create_game(self.test_game)

    def test_update_game(self):
        self.dao.create_game(self.test_game)
        saved_game = self.dao.get_game_by_id(
            self.test_game.product_id, self.test_game.game_id
        )
        assert saved_game.settings["test_setting"] == 1

        saved_game.settings["test_setting"] = 3
        self.dao.update_game(saved_game)

        updated_saved_game = self.dao.get_game_by_id(
            self.test_game.product_id, self.test_game.game_id
        )
        assert saved_game.settings["test_setting"] == 3

    def test_delete_game(self):
        self.dao.create_game(self.test_game)
        assert (
            self.dao.get_game_by_id(self.test_game.product_id, self.test_game.game_id)
            is not None
        )

        self.dao.delete_game(self.test_game.product_id, self.test_game.game_id)
        assert (
            self.dao.get_game_by_id(self.test_game.product_id, self.test_game.game_id)
            is None
        )

    def test_get_open_game_list(self):
        assert len(self.dao.get_available_games(self.test_game.product_id, 0, 10)) == 0
        self.dao.create_game(self.test_game)
        self.dao.publish_game(self.test_game)
        available_games = self.dao.get_available_games(self.test_game.product_id, 0, 10)
        assert len(available_games) == 1
        assert self.test_game.game_id == available_games[0].game_id

    def test_get_open_game_list_pagination(self):
        available_game_count = 20
        initial_game_id = self.test_game.game_id
        for i in range(available_game_count):
            self.test_game.game_id = f"{initial_game_id}_{str(i)}"
            self.dao.create_game(self.test_game)
            self.dao.publish_game(self.test_game)
            # Our game order precision is ms, create these too fast and we lose ordering
            # In the real world this doesn't matter
            time.sleep(0.1)

        # Default page fetch
        assert len(self.dao.get_available_games(self.test_game.product_id, 0, 10)) == 10

        # Small page fetch
        assert len(self.dao.get_available_games(self.test_game.product_id, 0, 5)) == 5

        # Test what happens when we exceed the number of available games
        assert (
            len(self.dao.get_available_games(self.test_game.product_id, 0, 100))
            == available_game_count
        )

        # Test what happens when we exceed the number of pages
        assert len(self.dao.get_available_games(self.test_game.product_id, 5, 10)) == 0

        # Test what happens when we fetch a page
        # which has fewer than 'count' entries
        assert len(self.dao.get_available_games(self.test_game.product_id, 6, 3)) == 2

        # Fetch the last page and verify it contains
        # the game that was created last - we can reference the
        # test game game_id here because we used the game creation loop
        # above to mofidy the ID, so the current ID should correspond to
        # the last game created
        assert (
            f"{initial_game_id}_{available_game_count - 1}"
            == self.dao.get_available_games(self.test_game.product_id, 19, 1)[0].game_id
        )

    def test_publish_game(self):
        self.dao.create_game(self.test_game)

        # Newly created games should be added to pending games by default
        assert self.test_game.game_id in self.dao.get_oldest_pending_games(
            self.test_game.product_id
        )

        self.dao.publish_game(self.test_game)

        # Game should have been removed from pending games and added to lobby games
        assert self.test_game.game_id not in self.dao.get_oldest_pending_games(
            self.test_game.product_id
        )
        assert self.test_game.game_id in self.dao.get_oldest_lobby_games(
            self.test_game.product_id
        )

    def test_start_game(self):
        # Create and activate a game - this should leave it in the lobby set
        self.dao.create_game(self.test_game)
        self.dao.publish_game(self.test_game)
        assert self.test_game.game_id in self.dao.get_oldest_lobby_games(
            self.test_game.product_id
        )

        # Game should be removed from the lobby set and added to the active set
        self.dao.start_game(self.test_game)
        assert self.test_game.game_id not in self.dao.get_oldest_lobby_games(
            self.test_game.product_id
        )
        assert self.test_game.game_id in self.dao.get_oldest_active_games(
            self.test_game.product_id
        )

    def test_reset_game(self):
        self.dao.create_game(self.test_game)
        self.dao.publish_game(self.test_game)
        self.dao.start_game(self.test_game)

        assert self.test_game.game_id in self.dao.get_oldest_active_games(
            self.test_game.product_id
        )

        self.dao.reset_game(self.test_game)

        assert self.test_game.game_id in self.dao.get_oldest_lobby_games(
            self.test_game.product_id
        )
        assert self.test_game.game_id not in self.dao.get_oldest_active_games(
            self.test_game.product_id
        )

    def test_get_oldest_pending_games(self):
        self.dao.create_game(self.test_game)
        assert self.test_game.game_id in self.dao.get_oldest_pending_games(
            self.test_game.product_id
        )

    def test_get_oldest_lobby_games(self):
        self.dao.create_game(self.test_game)
        self.dao.publish_game(self.test_game)
        assert self.test_game.game_id in self.dao.get_oldest_lobby_games(
            self.test_game.product_id
        )

    def test_get_oldest_active_games(self):
        self.dao.create_game(self.test_game)
        self.dao.publish_game(self.test_game)
        self.dao.start_game(self.test_game)
        assert self.test_game.game_id in self.dao.get_oldest_active_games(
            self.test_game.product_id
        )


@pytest.mark.usefixtures("dao_instance", "test_games")
class TestGameTransactions:
    def setup_method(self):
        self.redis_instance.flushdb()

    def test_non_existant_game(self):
        with GameTransaction("exrps", "non_existant_game_id") as (game_dao, game):
            assert game is None

    def test_existing_game_found(self):
        self.dao.create_game(self.test_game)
        with GameTransaction(self.test_game.product_id, self.test_game.game_id) as (
            game_dao,
            game,
        ):
            assert game is not None
            assert game.game_id == self.test_game.game_id

    def test_get_game_by_id_not_implemented(self):
        self.dao.create_game(self.test_game)
        with GameTransaction(self.test_game.product_id, self.test_game.game_id) as (
            game_dao,
            game,
        ):
            with pytest.raises(
                NotImplementedError,
                match=r"Cannot get game by ID in transactional DAO mode.*",
            ):
                game_dao.get_game_by_id(game.product_id, game.game_id)

    def test_create_game_not_implemented(self):
        self.dao.create_game(self.test_game)
        with GameTransaction(self.test_game.product_id, self.test_game.game_id) as (
            game_dao,
            game,
        ):
            with pytest.raises(
                NotImplementedError,
                match="Cannot create game in transactional DAO mode",
            ):
                game_dao.create_game(self.test_game)

    def test_modify_game_in_transaction(self):
        self.dao.create_game(self.test_game)
        assert self.test_game.state == GameState.CREATED

        with GameTransaction(self.test_game.product_id, self.test_game.game_id) as (
            game_dao,
            game,
        ):
            assert game is not None
            game.state = GameState.CREATOR_JOINED
            game_dao.update_game(game)

        updated_game = self.dao.get_game_by_id("exrps", self.test_game.game_id)
        assert updated_game is not None
        assert updated_game.state == GameState.CREATOR_JOINED

    def test_transaction_fail(self):
        self.dao.create_game(self.test_game)

        with pytest.raises(DaoTransactionError):
            with GameTransaction(self.test_game.product_id, self.test_game.game_id) as (
                game_dao,
                game,
            ):
                assert game is not None

                # Update game using the non transactional dao
                game.state = GameState.CREATOR_JOINED
                self.dao.update_game(game)

                # Now updating via transactional DAO should raise a watch error
                game.state = GameState.ALL_PLAYERS_JOINED
                game_dao.update_game(game)

        updated_game = self.dao.get_game_by_id("exrps", self.test_game.game_id)
        assert updated_game is not None
        assert updated_game.state == GameState.CREATOR_JOINED
