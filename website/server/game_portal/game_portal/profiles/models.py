from django.conf import settings

from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from game_portal.games.models import Game
from game_portal.accounts.models import Account


class Profile(models.Model):
    user: models.OneToOneField = models.OneToOneField(
        settings.AUTH_USER_MODEL, primary_key=True, on_delete=models.CASCADE
    )
    location: models.CharField = models.CharField(max_length=2, blank=True)
    level: models.IntegerField = models.IntegerField(default=1)
    xp: models.IntegerField = models.IntegerField(default=0)

    def __str__(self) -> str:
        return f"Profile: {self.user.username}"


######################## Signals ########################


@receiver(post_save, sender=Account)
def create_profile(sender, instance, created, **kwargs) -> None:
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=Account)
def save_profile(sender, instance, **kwargs) -> None:
    instance.profile.save()
