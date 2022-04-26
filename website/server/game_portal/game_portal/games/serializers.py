from rest_framework import serializers

from .models import Game


class GameSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Game
        fields = (
            "game_id",
            "name",
            "desc",
            "client_url",
            "cover_art",
            "banner_art",
            "stats_config",
            "game_state",
            "game_type",
        )
