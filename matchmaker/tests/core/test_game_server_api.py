import json

from unittest.mock import patch, MagicMock

import pytest

from core.game_server_api import (
    send_create_game_request,
    send_join_game_request,
    send_remove_game_request,
    send_remove_player_request,
    GameServerNetworkError,
)


class TestGameServerApi:

    ###################### CREATING GAMES ######################
    @patch("requests.post")
    def test_send_create_request_success(self, mocked_post, game_server_game_data):
        mocked_post.return_value = MagicMock()
        mocked_post.return_value.status_code = 200
        mocked_post.return_value.text = json.dumps(game_server_game_data)

        response = send_create_game_request(
            "UserA", "Aaaa", "def456", self._get_mock_game_server()
        )
        mocked_post.assert_called_once_with(
            "http://localhost/create_game",
            json={"gameId": "def456", "userId": "UserA", "username": "Aaaa"},
        )
        assert response == game_server_game_data

    @patch("requests.post")
    def test_send_create_request_failure(self, mocked_post, game_server_game_data):
        mocked_post.return_value = MagicMock()
        mocked_post.return_value.status_code = 500
        mocked_post.return_value.text = "Some remote server error"

        with pytest.raises(GameServerNetworkError) as e:
            send_create_game_request(
                "UserA", "Aaaa", "def456", self._get_mock_game_server()
            )
        assert (
            str(e.value)
            == "Game Server Network Error: GameServerAPI: Request failed. URL: http://localhost/create_game, Request Data: {'gameId': 'def456', 'userId': 'UserA', 'username': 'Aaaa'}, status code: 500, Response body: Some remote server error"
        )
        mocked_post.assert_called_once_with(
            "http://localhost/create_game",
            json={"gameId": "def456", "userId": "UserA", "username": "Aaaa"},
        )

    ###################### JOINING GAMES ######################
    @patch("requests.post")
    def test_send_join_request_success(self, mocked_post, game_server_game_data):
        mocked_post.return_value = MagicMock()
        mocked_post.return_value.status_code = 200
        mocked_post.return_value.text = json.dumps(game_server_game_data)

        response = send_join_game_request(
            "UserA", "Aaaa", "def456", self._get_mock_game_server()
        )
        assert response == game_server_game_data
        mocked_post.assert_called_once_with(
            "http://localhost/join_game",
            json={"gameId": "def456", "userId": "UserA", "username": "Aaaa"},
        )

    @patch("requests.post")
    def test_send_join_request_failure(self, mocked_post, game_server_game_data):
        mocked_post.return_value = MagicMock()
        mocked_post.return_value.status_code = 500
        mocked_post.return_value.text = "Some remote server error"

        with pytest.raises(GameServerNetworkError) as e:
            send_join_game_request(
                "UserA", "Aaaa", "def456", self._get_mock_game_server()
            )
        assert (
            str(e.value)
            == "Game Server Network Error: GameServerAPI: Request failed. URL: http://localhost/join_game, Request Data: {'gameId': 'def456', 'userId': 'UserA', 'username': 'Aaaa'}, status code: 500, Response body: Some remote server error"
        )
        mocked_post.assert_called_once_with(
            "http://localhost/join_game",
            json={"gameId": "def456", "userId": "UserA", "username": "Aaaa"},
        )

    ###################### REMOVING GAMES ######################
    @patch("requests.post")
    def test_send_remove_request_success(self, mocked_post, game_server_game_data):
        mocked_post.return_value = MagicMock()
        mocked_post.return_value.status_code = 200
        mocked_post.return_value.text = json.dumps(game_server_game_data)

        response = send_remove_game_request(self._get_mock_game_server(), "def456")
        assert response == game_server_game_data
        mocked_post.assert_called_once_with(
            "http://localhost/remove_game", json={"gameId": "def456"}
        )

    @patch("requests.post")
    def test_send_remove_request_failure(self, mocked_post, game_server_game_data):
        mocked_post.return_value = MagicMock()
        mocked_post.return_value.status_code = 500
        mocked_post.return_value.text = "Some remote server error"

        with pytest.raises(GameServerNetworkError) as e:
            response = send_remove_game_request(self._get_mock_game_server(), "def456")

        assert (
            str(e.value)
            == "Game Server Network Error: GameServerAPI: Request failed. URL: http://localhost/remove_game, Request Data: {'gameId': 'def456'}, status code: 500, Response body: Some remote server error"
        )
        mocked_post.assert_called_once_with(
            "http://localhost/remove_game", json={"gameId": "def456"}
        )

    ###################### RESETTING GAMES ######################
    @patch("requests.post")
    def test_send_remove_player_request_failure(
        self, mocked_post, game_server_game_data
    ):
        mocked_post.return_value = MagicMock()
        mocked_post.return_value.status_code = 200
        mocked_post.return_value.text = json.dumps(game_server_game_data)

        response = send_remove_player_request(
            self._get_mock_game_server(), "def456", "userA"
        )
        assert response == game_server_game_data
        mocked_post.assert_called_once_with(
            "http://localhost/remove_game", json={"gameId": "def456"}
        )

    @patch("requests.post")
    def test_send_remove_player_request_failure(
        self, mocked_post, game_server_game_data
    ):
        mocked_post.return_value = MagicMock()
        mocked_post.return_value.status_code = 500
        mocked_post.return_value.text = "Some remote server error"

        with pytest.raises(GameServerNetworkError) as e:
            response = send_remove_player_request(
                self._get_mock_game_server(), "def456", "userA"
            )

        assert (
            str(e.value)
            == "Game Server Network Error: GameServerAPI: Request failed. URL: http://localhost/remove_player, Request Data: {'gameId': 'def456', 'userId': 'userA'}, status code: 500, Response body: Some remote server error"
        )
        mocked_post.assert_called_once_with(
            "http://localhost/remove_player",
            json={"gameId": "def456", "userId": "userA"},
        )

    def _get_mock_game_server(self):
        game_server = MagicMock()
        game_server.game_server_url = "http://localhost"
        return game_server
