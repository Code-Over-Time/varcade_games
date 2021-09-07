import uuid

from django.db import models

from django.contrib.auth.models import AbstractUser


class AccountType:
    CONTRIBUTOR = "CO"
    PLAYER = "PL"


class Account(AbstractUser):
    id: models.UUIDField = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    email: models.EmailField = models.EmailField(unique=True)
    account_type: models.CharField = models.CharField(
        max_length=2, default=AccountType.PLAYER
    )

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = ["username"]
