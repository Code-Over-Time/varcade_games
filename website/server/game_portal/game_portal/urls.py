from game_portal import settings

from django.urls import include, path, re_path
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from rest_framework import routers

from rest_framework_simplejwt.views import TokenRefreshView

from .accounts import views as user_views
from .profiles import views as profile_views
from .profiles.serializers import ProfileTokenObtainPairSerializer
from .games import views as game_views


user_api_router = routers.DefaultRouter()
user_api_router.register(r"users", user_views.UserViewSet)

profile_api_router = routers.DefaultRouter()
profile_api_router.register(r"profiles", profile_views.ProfileViewSet)

game_api_router = routers.DefaultRouter()
game_api_router.register(r"games", game_views.GameViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    url("", include("django_prometheus.urls")),
    path("register/", user_views.RegistrationView.as_view(), name="register"),
    path(
        "token/",
        profile_views.ProfileTokenObtainPairView.as_view(
            serializer_class=ProfileTokenObtainPairSerializer
        ),
        name="token_obtain_pair",
    ),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("users/v1/", include(user_api_router.urls)),
    path("profiles/v1/", include(profile_api_router.urls)),
    path("games/v1/", include(game_api_router.urls)),
    path(
        "profile_service/v1/profile/",
        profile_views.ProfileServiceView.as_view(),
        name="profile_service",
    ),
    path(
        "games/v1/stats/<product_id>/",
        game_views.GameStatsView.as_view(),
        name="get_player_game_stats",
    ),
    path(
        "games/v1/leaderboard/<product_id>/",
        game_views.LeaderboardView.as_view(),
        name="get_game_leaderboard",
    ),
]

if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
