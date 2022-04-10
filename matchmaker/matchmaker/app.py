import logging

from flask import Flask
from flask_cors import CORS

import redis

from prometheus_flask_exporter import PrometheusMetrics

from config import get_config

from core.game_servers import initialise as initialise_game_server_interface
from lobby.api import game_lobby

from game_data.dao import initialise_db


# Custom rule for Prometheus group_by - we do this to track
# all requests by product_id AND because the default grouping
# will include paths with unique IDs, resulting in high cardinality
# metrics
def api_call(req):
    """The name of the function becomes the label name."""
    if not req.view_args:
        return f"{req.endpoint}"
    return f'{req.endpoint}.{req.view_args.get("product_id", "")}'


def create_app(mode) -> Flask:
    app = Flask(__name__)
    app.config.from_object(get_config(mode))
    logging.basicConfig(format=app.config["LOG_FORMAT"], level=app.config["LOG_LEVEL"])
    logging.info(f"Initializing matchmaker server in {mode} mode ...")
    CORS(app)
    metrics = PrometheusMetrics(
        app, defaults_prefix="matchmaker_server", group_by=api_call
    )
    initialise_db(app.config["REDIS_URL"], app.config["CACHE_URL"])
    initialise_game_server_interface(app.config["ACTIVE_GAMES"])
    _register_blueprints(app)
    return app


def _register_blueprints(app: Flask):
    app.register_blueprint(game_lobby, url_prefix="/game_lobby")


if __name__ == "__main__":
    create_app("development").run(host="0.0.0.0", port=5050)
