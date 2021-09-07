import logging

from redis import WatchError

from core.db import get_stats_tracker_db


class StatsHandler:
    """This class can be overridden and registered as a player stats handler. This gives individual games
    the ability to store custom player stats
    """

    def process_event(self, event):
        raise NotImplementedError()

    def get_stats(self, product_id, user_id):
        raise NotImplementedError()


class PlayerStatsHandler(StatsHandler):
    """This is a generic implementation of a stats handler. Any product that sends
    game_over events in the correct format will automatically get handled here
    """

    def process_event(self, event):
        try:
            if event["type"] == "game_over":
                logging.info(f"EXRPSStatsHandler: Handling event: {event}")
                for i in range(10):
                    try:
                        winner_stats_key = (
                            f"_pstats:{event['winner_id']}:{event['product_id']}"
                        )
                        loser_stats_key = (
                            f"_pstats:{event['loser_id']}:{event['product_id']}"
                        )
                        pipe = get_stats_tracker_db().pipeline()
                        pipe.watch(winner_stats_key)
                        pipe.watch(loser_stats_key)
                        pipe.multi()
                        pipe.hincrby(winner_stats_key, "games", 1)
                        pipe.hincrby(winner_stats_key, "wins", 1)
                        pipe.hincrby(winner_stats_key, "losses", 0)
                        pipe.hincrby(loser_stats_key, "games", 1)
                        pipe.hincrby(loser_stats_key, "losses", 1)
                        pipe.hincrby(loser_stats_key, "wins", 0)
                        pipe.execute()
                        return
                    except WatchError:
                        logging.warning(
                            f"Watch error writing player stats. Attempt: {i}"
                        )
                logging.error(f"FAILED TO WRITE LEADERBOARD SCORE DUE TO WATCH ERRORS")
        except KeyError:
            logging.warning(f"Invalid event received: {event}")

    def get_stats(self, product_id: str, user_id: str) -> dict:
        return {
            a.decode("utf-8"): b.decode("utf-8")
            for a, b in get_stats_tracker_db()
            .hgetall(f"_pstats:{user_id}:{product_id}")
            .items()
        }


class EXRPSStatsHandler(PlayerStatsHandler):
    """Event handler for exRPS specific multiplayer stats."""

    def process_event(self, event):
        try:
            if event.get("event_name") == "select_weapon":
                logging.info(f"EXRPSStatsHandler: Handling event: {event}")
                user_id = event["user_id"]
                selection = {
                    "null": "botch",
                    "0": "rock",
                    "1": "paper",
                    "2": "scissors",
                }[event["event_data"]]

                get_stats_tracker_db().hincrby(
                    f"_pstats:{event['user_id']}:{event['product_id']}",
                    f"{selection}_selection_count",
                    1,
                )
            else:
                super().process_event(event)
        except KeyError:
            logging.warning(f"Invalid exRPS event received: {event}")
