import pytest

from rest_framework.reverse import reverse

from rest_framework.test import APIRequestFactory, force_authenticate

from game_portal.accounts.models import Account

from game_portal.profiles.models import Profile
from game_portal.profiles.serializers import ProfileSerializer
from game_portal.profiles.views import ProfileServiceView


@pytest.mark.django_db
class TestProfileModel:
    def setup_method(self):
        self.user = Account.objects.create_user("test_user", "user@test.com", "pass")

    def test_profile_receiver(self):
        """Verify that a profile is created automatically and properly when a User is created"""
        profile = Profile.objects.get(user_id=self.user.id)
        assert profile is not None
        assert profile.level == 1
        assert profile.xp == 0
        assert profile.location == ""

    def test_profile_str(self):
        profile = Profile.objects.get(user_id=self.user.id)
        assert str(profile) == f"Profile: test_user"


@pytest.mark.django_db
class TestGameViewset:
    def setup_method(self):
        self.user = Account.objects.create_user("test_user", "user@test.com", "pass")

    def test_game_viewset_get_user_profile_no_auth(self, api_client):
        url = reverse("profile_service")
        response = api_client.get(url)
        assert response.status_code == 200

    def test_game_viewset_get_user_profile(self, api_client):
        factory = APIRequestFactory()
        view = ProfileServiceView.as_view()

        request = factory.get(reverse("profile_service"))
        force_authenticate(request, user=self.user)
        response = view(request)

        assert response.status_code == 200
