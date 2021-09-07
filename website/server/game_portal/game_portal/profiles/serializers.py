from django.contrib.auth import get_user_model

from rest_framework import serializers

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from game_portal.accounts.serializers import UserSerializer

from .models import Profile


class ProfileTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = get_user_model().EMAIL_FIELD

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        profile = Profile.objects.get(user=user)
        token["username"] = user.username
        token["account_type"] = user.account_type
        token["location"] = profile.location
        return token


class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ("user", "level")
