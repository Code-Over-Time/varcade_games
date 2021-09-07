import json

import logging

from werkzeug.local import LocalProxy

from flask import Blueprint, make_response, current_app

from leaderboards.leaderboards import get_top_players


leaderboards_blueprint = Blueprint("leaderboards", __name__)


@leaderboards_blueprint.route("/top_ten/<product_id>")
def get_leaderboard(product_id: str):
    logging.info(f"Fetching leaderboard for product: {product_id}")
    return make_response(json.dumps(get_top_players(product_id)), 200)
