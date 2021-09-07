import pytest

from django.test import TestCase

from rest_framework.reverse import reverse
from rest_framework_simplejwt.tokens import RefreshToken

from game_portal.accounts.models import Account

from game_portal.games.models import Game
from game_portal.games.serializers import GameSerializer


class TestGameModel:
    def setup_method(self):
        Game.objects.create(
            game_id="exrps",
            name="Rock paper scissors",
            desc="Some exciting game description",
            client_url="http://localhost:8080",
        )

    def test_game_str(self):
        game = Game.objects.get(game_id="exrps")
        assert str(game) == "Rock paper scissors"


class TestGameViewset:
    def setup_method(self):
        Game.objects.create(
            game_id="exrps",
            name="Rock paper scissors",
            desc="Some exciting game description",
            client_url="http://localhost:8080",
            game_state="ACT",
        )
        self.test_user = Account.objects.create_user(
            "test_user", "test@test.com", "pa88w0rd"
        )

    def test_game_viewset_get_games_list(self, api_client):
        url = reverse("game-list")
        refresh = RefreshToken.for_user(self.test_user)
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        response = api_client.get(url)
        assert response.status_code == 200
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["game_id"] == "exrps"


class TestGameSerializer:
    def setup_method(self):
        Game.objects.create(
            game_id="exrps",
            name="Rock paper scissors",
            desc="Some exciting game description",
            client_url="http://localhost:8080",
            game_state="ACT",
        )
        self.test_user = Account.objects.create_user(
            "test_user", "test@test.com", "pa88w0rd"
        )

    def test_game_viewset_get_games_list(self, api_client):
        url = reverse("game-list")
        refresh = RefreshToken.for_user(self.test_user)
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        response = api_client.get(url)
        # Verify serializer fields
        game_data = response.data["results"][0]
        assert len(response.data["results"][0]) == len(GameSerializer.Meta.fields)
        assert "game_id" in game_data
        assert "name" in game_data
        assert "desc" in game_data
        assert "client_url" in game_data
