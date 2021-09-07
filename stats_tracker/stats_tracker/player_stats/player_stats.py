import logging

from core.errors import InvalidProductIdError

from .handlers import StatsHandler


# Stats handler for different product are registered here.
# StatsHandlers are responsible for processing game specifc events
# and storing any relevant stats in the Stats Tracker DB.
# They are also responsible for fetching stats, as no schemas or
# standards  for events or stats are enforced.
_PLAYER_STATS_HANDLERS = {}


def register_player_stats_handler(product_id: str, handler: StatsHandler):
    """Adds a PlayerStatsHandler for the given product ID. When game events
        are received for this product, the registered handler will be run in order
        to store per-player game-specific stats.

    raises ValueError:  If there is already a handler registered for the given product or
                        the given Handler is not the correct type.
    """
    logging.info(
        f"Registering player stats handler for product id: {product_id}. Handler: {handler}"
    )
    if product_id in _PLAYER_STATS_HANDLERS:
        logging.warning(
            f"Unable to register stats handler for product {product_id}. "
            f"A handler for this product already exists."
        )
        return

    if not isinstance(handler, StatsHandler):
        raise ValueError(
            f"Unable to register stats handler for product {product_id}. "
            f"Handlers must inherit from stats_tracker.handlers.StatsHandler."
        )

    _PLAYER_STATS_HANDLERS[product_id] = handler


def track_event(product_id: str, event: dict):
    """This function will handle a game event if a handler has been registered for that
        product. Event handling is product specific - this function does not care about
        the contents of 'event, but the event cannot be None.

    raises ValueError:  If the given event is None or there is no handler registered for
                        the given product id
    """
    if event is None:
        raise ValueError("Null event received for product: {product_id}")

    stats_handler = _PLAYER_STATS_HANDLERS.get(
        product_id, None
    ) or _PLAYER_STATS_HANDLERS.get("default", None)
    if stats_handler is None:
        raise InvalidProductIdError(
            f"Unable to process player stats for event, "
            f"there is no registered handler or default handler for the product with ID: {product_id}"
        )
    stats_handler.process_event(event)


def get_stats_for_game(product_id: str, user_id: str) -> dict:
    """Fetches all stats that a player has logged against the given product id.

    The format of the stats will vary from product to product.
    """
    if product_id not in _PLAYER_STATS_HANDLERS:
        raise InvalidProductIdError(
            f"Unable to load player stats, "
            f"there is no registered handler for the product with ID: {product_id}"
        )
    else:
        return _PLAYER_STATS_HANDLERS[product_id].get_stats(product_id, user_id)
