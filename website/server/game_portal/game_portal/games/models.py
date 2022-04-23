from django.db import models


class Game(models.Model):
    class GameTypes(models.TextChoices):
        SINGLE_PLAYER_ONLY = "SPO", "SinglePlayerOnly"
        MULTI_PLAYER_ONLY = "MPO", "MultiPlayerOnly"
        MULTI_AND_SINGLE_PLAYER = "MSP", "MultiAndSinglePlayer"

    class GameState(models.TextChoices):
        ACTIVE = "ACT", "Active"
        INACTIVE = "INA", "Inactive"
        COMING_SOON = "CMS", "ComingSoon"

    game_id: models.CharField = models.CharField(max_length=10)
    name: models.CharField = models.CharField(max_length=40)
    desc: models.CharField = models.CharField(max_length=180)
    client_url: models.CharField = models.CharField(max_length=160)
    cover_art: models.ImageField = models.ImageField(upload_to="images", null=True)
    banner_art: models.ImageField = models.ImageField(upload_to="images", null=True)
    stats_config: models.FileField = models.FileField(
        upload_to="stats_config", null=True
    )
    game_type: models.CharField = models.CharField(
        max_length=3, choices=GameTypes.choices, default=GameTypes.SINGLE_PLAYER_ONLY
    )
    game_state: models.CharField = models.CharField(
        max_length=3, choices=GameState.choices, default=GameState.INACTIVE
    )

    def __str__(self) -> str:
        return self.name
