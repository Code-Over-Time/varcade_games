from game_portal.settings import *

# make tests faster
SOUTH_TESTS_MIGRATE = False
DATABASES["default"] = {
    "ENGINE": "django.db.backends.sqlite3",
    "NAME": "/tmp/game_portal_test.sqlite",
}
REDIS_STREAM_HOST = "localhost"
