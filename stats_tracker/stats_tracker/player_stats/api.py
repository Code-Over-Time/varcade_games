import json

import logging

from werkzeug.local import LocalProxy

from flask import Blueprint, make_response, current_app

from player_stats.player_stats import get_stats_for_game


player_stats = Blueprint("player_stats", __name__)


@player_stats.route("/<product_id>/<user_id>")
def get_player_stats(product_id, user_id):
    logging.info(f"Fetching stats for player: {user_id}, product: {product_id}")
    return make_response(json.dumps(get_stats_for_game(product_id, user_id)), 200)
