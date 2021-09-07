import json

from unittest.mock import patch, Mock

import pytest

import requests

from game_data.models import Game, GameState

from core.game_server_api import GameServerNetworkError

#######################################################
#
#               TEST CREATING GAMES
#
#######################################################


@pytest.mark.usefixtures("dao_instance", "test_games")
class TestGameCreationAPI:
    def setup_method(self):
        self.redis_instance.flushdb()

    @patch("lobby.api.send_create_game_request")
    def test_create_game(
        self,
        mock_create_remote_game,
        test_client,
        create_request_body,
        valid_product_id,
        user_profile_A,
        user_profile_A_jwt_token,
        game_token,
    ):
        mock_create_remote_game.return_value = game_token

        response = test_client.post(
            f"game_lobby/{valid_product_id}/create_game",
            json=create_request_body,
            headers={"Authorization": f"Token {user_profile_A_jwt_token}"},
        )
        assert response.status_code == 200
        assert '"product_id": "exrps"' in str(response.data)
        assert '"creator_id": "UserA"' in str(response.data)

        assert mock_create_remote_game.call_count == 1

    @patch("lobby.api.send_create_game_request")
    def test_create_game_remote_game_server_error(
        self,
        mock_create_remote_game,
        test_client,
        create_request_body,
        valid_product_id,
        user_profile_A,
        user_profile_A_jwt_token,
    ):
        mock_create_remote_game.side_effect = GameServerNetworkError(
            f"request failed", 400, "Error text"
        )

        response = test_client.post(
            f"game_lobby/{valid_product_id}/create_game",
            json=create_request_body,
            headers={"Authorization": f"Token {user_profile_A_jwt_token}"},
        )
        assert response.status_code == 400
        assert (
            response.data.decode("utf-8")
            == "Unable to create game on target game server."
        )

    @patch("lobby.api.send_create_game_request")
    def test_create_game_remote_game_server_error_unknown(
        self,
        mock_create_remote_game,
        test_client,
        create_request_body,
        valid_product_id,
        user_profile_A,
        user_profile_A_jwt_token,
    ):
        mock_create_remote_game.side_effect = Exception("Unexpected error")

        response = test_client.post(
            f"game_lobby/{valid_product_id}/create_game",
            json=create_request_body,
            headers={"Authorization": f"Token {user_profile_A_jwt_token}"},
        )

        assert response.status_code == 500
        assert (
            response.data.decode("utf-8")
            == "An unexpected error occurred. Pleace contact support."
        )

    @patch("lobby.api.get_game_dao")
    @patch("lobby.api.send_create_game_request")
    @patch("lobby.api.send_remove_game_request")
    def test_create_game_data_persistance_fails(
        self,
        send_remove_game_request,
        mock_create_remote_game,
        mocked_dao,
        test_client,
        create_request_body,
        valid_product_id,
        user_profile_A,
        user_profile_A_jwt_token,
        game_token,
    ):
        """This is testing the case where all creation succeeds except the final
        write of the Game data to the DB. So the game will have been created on the
        remote server.
        """
        mock_create_remote_game.return_value = game_token
        send_remove_game_request.return_value = None
        mocked_dao.side_effect = Exception("Forcing error case when serializing")

        response = test_client.post(
            f"game_lobby/{valid_product_id}/create_game",
            json=create_request_body,
            headers={"Authorization": f"Token {user_profile_A_jwt_token}"},
        )
        assert response.status_code == 500
        assert "Error saving the game" in response.data.decode("utf-8")
        # This mock served as both create and remove game so should have been called twice
        assert send_remove_game_request.call_count == 1

    @patch("lobby.api.get_game_dao")
    @patch("lobby.api.send_create_game_request")
    @patch("lobby.api.send_remove_game_request")
    def test_create_game_data_persistance_fails_and_clean_up_fails(
        self,
        send_remove_game_request,
        mock_create_remote_game,
        mocked_dao,
        test_client,
        create_request_body,
        valid_product_id,
        user_profile_A,
        user_profile_A_jwt_token,
        game_token,
    ):
        """This is testing the case where all creation succeeds except the final
        write of the Game data to the DB, and THEN the subsequent clean up fails.
        So the game will have been created on the remote server, but we failed to save
        on our end and failed to clean it up
        """
        mock_create_remote_game.return_value = game_token
        send_remove_game_request.side_effect = Exception(
            "Forcing error case when cleaning up"
        )
        mocked_dao.side_effect = Exception("Forcing error case when serializing")

        response = test_client.post(
            f"game_lobby/{valid_product_id}/create_game",
            json=create_request_body,
            headers={"Authorization": f"Token {user_profile_A_jwt_token}"},
        )
        assert response.status_code == 500
        assert "Error saving the game" in response.data.decode("utf-8")
        assert send_remove_game_request.call_count == 1

    @patch("lobby.api.send_create_game_request")
    def test_create_game_auth_header_missing(
        self,
        mock_create_remote_game,
        test_client,
        create_request_body,
        valid_product_id,
        user_profile_A,
        game_token,
    ):
        mock_create_remote_game.return_value = game_token
        response = test_client.post(
            f"game_lobby/{valid_product_id}/create_game", json=create_request_body
        )

        assert response.status_code == 401
        assert "Game Lobby: Not authorized." in response.data.decode("utf-8")

    def test_create_game_auth_failure(
        self, test_client, create_request_body, valid_product_id
    ):
        response = test_client.post(
            f"game_lobby/{valid_product_id}/create_game",
            json=create_request_body,
            headers={"Authorization": "Token test_auth_token"},
        )
        assert response.status_code == 401
        assert (
            "Game Lobby: Unable to fetch user profile for user. Relog may be required."
            in response.data.decode("utf-8")
        )

    def test_invalid_product_id_on_game_creation(
        self, test_client, create_request_body
    ):
        response = test_client.post(
            f"game_lobby/invalid_product_id/create_game",
            json=create_request_body,
            headers={"Authorization": "Token test_auth_token"},
        )
        assert response.status_code == 400
        assert "Game Lobby: Invalid product ID." in response.data.decode("utf-8")


#######################################################
#
#               TEST JOINING GAMES
#
#######################################################


@pytest.mark.usefixtures("dao_instance", "test_games")
class TestJoinGameAPI:
    def setup_method(self):
        self.redis_instance.flushdb()

    @patch("lobby.api.send_join_game_request")
    def test_join_non_existant_game(
        self,
        mock_join_remote_game,
        test_client,
        user_profile_B,
        user_profile_B_jwt_token,
        game_token,
    ):
        mock_join_remote_game.return_value = game_token

        response = test_client.post(
            f"game_lobby/{self.test_game.product_id}/join_game/non_existant_game_id",
            headers={"Authorization": f"Token {user_profile_B_jwt_token}"},
        )

        assert response.status_code == 404
        assert "game not found" in str(response.data)

    @patch("lobby.api.send_join_game_request")
    def test_join_game_success(
        self,
        mock_join_remote_game,
        test_client,
        user_profile_B,
        user_profile_B_jwt_token,
        game_token,
    ):
        self.dao.create_game(self.test_active_game)
        mock_join_remote_game.return_value = game_token

        response = test_client.post(
            f"game_lobby/{self.test_active_game.product_id}/join_game/{self.test_active_game.game_id}",
            headers={"Authorization": f"Token {user_profile_B_jwt_token}"},
        )

        assert response.status_code == 200
        game_data = json.loads(response.data)
        assert game_data["game_id"] == self.test_active_game.game_id
        # Our creator and our newly joined player should be in the players list
        assert self.test_active_game.creator_id in game_data["players"]
        assert "UserB" in game_data["players"]

    @patch("lobby.api.send_join_game_request")
    def test_join_game_remote_game_server_error(
        self,
        mock_join_remote_game,
        test_client,
        user_profile_B,
        user_profile_B_jwt_token,
    ):
        self.dao.create_game(self.test_active_game)
        mock_join_remote_game.side_effect = GameServerNetworkError(
            f"request failed", 400, "Error text"
        )

        response = test_client.post(
            f"game_lobby/{self.test_active_game.product_id}/join_game/{self.test_active_game.game_id}",
            headers={"Authorization": f"Token {user_profile_B_jwt_token}"},
        )

        assert response.status_code == 400
        assert (
            response.data.decode("utf-8")
            == "Unable to join game on target game server."
        )

    @patch("lobby.api.send_join_game_request")
    def test_join_game_remote_game_server_error_unknown(
        self,
        mock_join_remote_game,
        test_client,
        user_profile_B,
        user_profile_B_jwt_token,
    ):
        self.dao.create_game(self.test_active_game)
        mock_join_remote_game.side_effect = Exception("Unexpected error")

        response = test_client.post(
            f"game_lobby/{self.test_active_game.product_id}/join_game/{self.test_active_game.game_id}",
            headers={"Authorization": f"Token {user_profile_B_jwt_token}"},
        )

        assert response.status_code == 500
        assert (
            response.data.decode("utf-8")
            == "An unexpected error occurred. Please contact support."
        )

    @patch("lobby.api.send_join_game_request")
    def test_join_game_without_activation(
        self,
        mock_join_remote_game,
        test_client,
        user_profile_B,
        user_profile_B_jwt_token,
        game_token,
    ):
        # Here we test that we can join a game without activiating it - ie. it has not
        # reached capacity. This will be the case when a game supports more than two players
        self.test_active_game.settings["num_players"] = 3
        self.dao.create_game(self.test_active_game)
        mock_join_remote_game.return_value = game_token

        response = test_client.post(
            f"game_lobby/{self.test_active_game.product_id}/join_game/{self.test_active_game.game_id}",
            headers={"Authorization": f"Bearer {user_profile_B_jwt_token}"},
        )

        assert response.status_code == 200
        game_data = json.loads(response.data)
        assert game_data["game_id"] == self.test_active_game.game_id
        assert "UserB" in game_data["players"]

    @patch("lobby.api.GameTransaction")
    @patch("lobby.api.send_join_game_request")
    def test_join_game_remote_game_success_local_game_not_found(
        self,
        mock_join_remote_game,
        mocked_transaction,
        test_client,
        user_profile_B,
        user_profile_B_jwt_token,
        game_token,
    ):
        mocked_transaction.return_value.__enter__.return_value = (None, None)
        mock_join_remote_game.return_value = game_token

        self.dao.create_game(self.test_active_game)
        response = test_client.post(
            f"game_lobby/{self.test_active_game.product_id}/join_game/{self.test_active_game.game_id}",
            headers={"Authorization": f"Token {user_profile_B_jwt_token}"},
        )

        assert response.status_code == 400
        assert (
            response.data.decode("utf-8")
            == "GameLobby: Cannot join game - it is no longer available"
        )

    @patch("lobby.api.send_join_game_request")
    def test_join_game_creator_not_joined(
        self,
        mock_join_remote_game,
        test_client,
        user_profile_B,
        user_profile_B_jwt_token,
        game_token,
    ):
        mock_join_remote_game.return_value = game_token

        self.dao.create_game(self.test_game)
        response = test_client.post(
            f"game_lobby/{self.test_active_game.product_id}/join_game/{self.test_game.game_id}",
            headers={"Authorization": f"Bearer {user_profile_B_jwt_token}"},
        )

        assert response.status_code == 400
        assert (
            f"Unable to join game - invalid state: {GameState.CREATED}. Required state: {GameState.CREATOR_JOINED}"
            in response.data.decode("utf-8")
        )

    def test_join_game_auth_header_missing(self, test_client):
        self.dao.create_game(self.test_active_game)
        response = test_client.post(
            f"game_lobby/{self.test_active_game.product_id}/join_game/{self.test_active_game.game_id}"
        )

        assert response.status_code == 401
        assert "Game Lobby: Not authorized." in response.data.decode("utf-8")

    def test_join_game_auth_failure(self, test_client, user_profile_B, game_token):
        self.dao.create_game(self.test_active_game)
        response = test_client.post(
            f"game_lobby/{self.test_active_game.product_id}/join_game/{self.test_active_game.game_id}",
            headers={"Authorization": "Bearer invalid_token"},
        )

        assert response.status_code == 401
        assert (
            "Game Lobby: Unable to fetch user profile for user. Relog may be required."
            in response.data.decode("utf-8")
        )

    def test_invalid_product_id_on_join(self, test_client, user_profile_B, game_token):
        self.dao.create_game(self.test_active_game)
        response = test_client.post(
            f"game_lobby/invalid_product_id/join_game/{self.test_active_game.game_id}"
        )

        assert response.status_code == 400
        assert "Game Lobby: Invalid product ID." in response.data.decode("utf-8")


#######################################################
#
#               TEST FINDING GAMES
#
#######################################################


@pytest.mark.usefixtures("dao_instance", "test_games")
class TestFindGameAPI:
    def setup_method(self):
        self.redis_instance.flushdb()

    def test_view_available_games_success(self, test_client):
        response = test_client.get(
            f"game_lobby/{self.test_game.product_id}/open_games",
            headers=[("Content-Type", "application/json")],
        )
        # No games create yet
        assert len(json.loads(response.data)) == 0

        self.dao.create_game(self.test_game)
        self.dao.publish_game(self.test_game)

        response = test_client.get(
            f"game_lobby/{self.test_game.product_id}/open_games",
            headers=[("Content-Type", "application/json")],
        )

        game_list = json.loads(response.data)
        assert len(game_list) == 1
        assert game_list[0]["game_id"] == self.test_game.game_id

    def test_view_available_games_pagination(self, test_client):
        response = test_client.get(
            f"game_lobby/{self.test_game.product_id}/open_games",
            headers=[("Content-Type", "application/json")],
        )

        created_games = []
        default_page_size = test_client.config["LOBBY_DEFAULT_PAGE_SIZE"]
        created_game_counted = default_page_size * 2

        for i in range(created_game_counted):
            # Create enough games to test the default lobby page size
            # A bunch of clones of our test game is good enough here
            game_to_create = self.test_game.to_dict()
            game_to_create["game_id"] = f"{self.test_game.game_id}_{str(i)}"
            new_game = Game.from_dict(game_to_create)
            self.dao.create_game(new_game)
            self.dao.publish_game(new_game)
            created_games.append(new_game)

        response = test_client.get(
            f"game_lobby/{self.test_game.product_id}/open_games",
            headers=[("Content-Type", "application/json")],
        )

        game_list = json.loads(response.data)
        assert len(game_list) == default_page_size

        response = test_client.get(
            f"game_lobby/{self.test_game.product_id}/open_games?count=5&page=0",
            headers=[("Content-Type", "application/json")],
        )
        page1 = json.loads(response.data)
        assert len(page1) == 5

        response = test_client.get(
            f"game_lobby/{self.test_game.product_id}/open_games?count=5&page=2",
            headers=[("Content-Type", "application/json")],
        )
        page2 = json.loads(response.data)
        assert len(page2) == 5

        # No need to do detailed pagination verification here as it is done in the dao tests
        # Just make sure game we get a different set of games return from both calls
        assert (
            set([g["game_id"] for g in page1]).intersection(
                set([g["game_id"] for g in page2])
            )
            == set()
        )

    def test_view_available_games_invalid_request_args(self, test_client):
        response = test_client.get(
            f"game_lobby/{self.test_game.product_id}/open_games?page=test",
            headers=[("Content-Type", "application/json")],
        )
        assert response.status_code == 400

        response = test_client.get(
            f"game_lobby/{self.test_game.product_id}/open_games?count=test",
            headers=[("Content-Type", "application/json")],
        )
        assert response.status_code == 400
