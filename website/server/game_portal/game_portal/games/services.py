from django.conf import settings

import requests
import logging


def get_leaderboard(product_id):
    logging.info(f"Requesting top ten for product: {product_id}")
    response = requests.get(
        f"{settings.STATS_TRACKER_CONFIG['url']}/" f"leaderboards/top_ten/{product_id}"
    )
    return response.json()


def get_player_stats_for_game(product_id, user_id):
    logging.info(f"Requesting stats for user: {user_id}, product: {product_id}")
    response = requests.get(
        f"{settings.STATS_TRACKER_CONFIG['url']}/" f"stats/{product_id}/{user_id}"
    )
    return response.json()
