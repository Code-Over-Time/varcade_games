import logging

from flask import Flask

import redis

from prometheus_flask_exporter import PrometheusMetrics

from config import get_config

from core.db import initialise_db
from core.errors import InvalidProductIdError

from leaderboards.api import leaderboards_blueprint
from leaderboards.handlers import LeaderboardHandler
from leaderboards.leaderboards import register_leaderboard_handler

from player_stats.api import player_stats
from player_stats.player_stats import register_player_stats_handler
from player_stats.handlers import EXRPSStatsHandler, PlayerStatsHandler


# Custom rule for Prometheus group_by - we do this to track
# all requests by product_id AND because the default grouping
# will include paths with unique IDs, resulting in high cardinality
# metrics
def api_call(req):
    """The name of the function becomes the label name."""
    return f'{req.endpoint}.{req.view_args.get("product_id", "")}'


def create_app(mode) -> Flask:
    app = Flask(__name__)
    app.config.from_object(get_config(mode))
    logging.basicConfig(format=app.config["LOG_FORMAT"], level=app.config["LOG_LEVEL"])
    logging.info(f"Initializing stats tracker server in {mode} mode ...")
    metrics = PrometheusMetrics(app, defaults_prefix="stats_server", group_by=api_call)
    register_error_handlers(app)
    init_stats_tracker(app.config["STATS_TRACKER_REDIS_URL"])
    register_blueprints(app)
    logging.info("Server initialization complete.")
    return app


def init_stats_tracker(db_url_str: str):
    initialise_db(db_url_str)
    # Add stats handlers for all products here.
    logging.info("Registering player stats handlers.")
    register_player_stats_handler("default", PlayerStatsHandler())
    register_leaderboard_handler("default", LeaderboardHandler())
    register_player_stats_handler("exrps", EXRPSStatsHandler())


def register_blueprints(app: Flask):
    logging.info("Registering blueprints.")
    app.register_blueprint(player_stats, url_prefix="/stats")
    app.register_blueprint(leaderboards_blueprint, url_prefix="/leaderboards")


def register_error_handlers(app: Flask):
    @app.errorhandler(InvalidProductIdError)
    def product_id_error(err):
        app.logger.exception(err)
        return "Invalid product Id", 400


if __name__ == "__main__":
    logging.info("Running stats tracker on 0.0.0.0:5000.")
    create_app("development").run(host="0.0.0.0", port=5000)
