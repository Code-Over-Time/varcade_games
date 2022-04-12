[![Screenshot of player stats UI from the game portal](img/vcg_stats_ui.png)](img/vcg_stats_ui.png)

We have reached the final service on our whirlwind tour of Varcade Games.

The `Stats Tracker`.

This service uses all of the same tech as the Matchmaker so we won't need to spend to long here.

Its job is to listen our for game events and use that data to build leaderboards and player statistics for any games registered on Varcade Games.

The code for this project is located in the `stats_tracker` directory of your project root. The project structure should be immediately familiar after looking at the Matchmaker project.

In this section we'll check out a interesting aspects of the Stats Tracker and at the end you will run the project tests and checks yourself, just as you've done before on other projects.

## High Level View

[![Screenshot of character stats UI from the game](img/stats_tracker_structure.png)](img/stats_tracker_structure.png)

This hopefully all makes sense given the fact that the Stats Tracker works much the same way as the Matchmaker.

It has a public API for the game portal to connect to. It uses this API to fetch leaderboards and player stats for different games.

It also have a worker that runs in the background consuming events from the event stream and updating leaderboards and stats based on those events.

## Key Concepts

There's an `api.py` in both the `stats_tracker/leaderboards` and `stats_tracker/player_stats`. 

The Game Portal calls the leaderboard API to check the current leaderboard for a registered game.

The Player Stats API is where the Game Portal gets per player, per game player statistics.

To manage all of this we use a pluggable system for calculating scores based on game events.

A game can provide its own scoring logic or us the default system logic. 

Let's look at leaderboards first.

### Leaderboards

Open up `leaderboards/leaderboards.py`. You will find two important functions here.

* register_leaderboard_handler
* record_result

The first function allows you to register a leaderboard 'handler' for a game.

The second allows you to record the result of a multiplayer game so that the game's leaderboard gets updated.

The registration process is very similar to the WorkerManager -> Worker relationship we saw earlier.

In this case we create an instance of a `Leaderboard handler` and register it against the ID for any game we want to register.

Then when we get a game event, we read the product ID from the event and look up the appropriate handler.

Once we have a leaderboard handler we can record a result. The record result function signature looks like this:

```python
def record_result(product_id: str, winner_id: str, loser_id: str) -> bool:
```

What the system will do is get both player's current scores and then update them based on who won.

The default system leaderboard handler simple adds 1 point for every win. You could change this behavior for other games by adding new handlers that run ELO calculations or other more advanced leaderboard scoring.

If you open `leaderboards/handler.py` you will find the default handler:

```python
class LeaderboardHandler:
    """This class can be overridden and registered as a leaderboard handler. This gives individual games
    the ability to handle more complex scoring, such as ELO
    """

    def get_updated_scores(
        self, winner_id, winner_current_score, loser_id, loser_current_score
    ):
        """
        Default implementation with return current score + 1 for the winner and current score for the loser

        returns: tuple containing the new score for the winner and the new scores for the loser
        """
        if winner_current_score is None:
            winner_current_score = 0
        if loser_current_score is None:
            loser_current_score = 0
        return (winner_current_score + 1, loser_current_score)

```

A valid Leaderboard handler class must include the `get_updated_scores` method.

As you can see the default logic is pretty simple.

To register leaderboard handlers you can add them in `stats_tracker/app.py`:

```python
def init_stats_tracker(db_url_str: str):
    initialise_db(db_url_str)
    # Add stats handlers for all products here.
    logging.info("Registering player stats handlers.")
    register_player_stats_handler("default", PlayerStatsHandler())
    register_leaderboard_handler("default", LeaderboardHandler())
    register_player_stats_handler("exrps", EXRPSStatsHandler())
```

We register a single Leaderboard handler there, but we register two 'Player Stats Handlers', so lets have a look at why that is.

### Player Stats

Open up `player_stats/player_stats.py`. You'll notice that it is more or less the same setup as for our Leaderboards.

For Player Stats however, we have a `track_event` function instead of a `record_result` function.

It does however do more or less the same thing. It looks up a handler for the given product ID and uses it to process the given event.

If you open up `player_stats/handlers.py` you will see exactly what the handlers do.

The first handler you will find is the `PlayerStatsHandler`. This is a generic handler that can read 'game_over' events coming from the game servers. It has some simple logic that will update redis with a win/loss value for each player referenced in the event.

Any two player multi-player game that just wants to track wins and losses could just use this simple handler.

Rock Paper Scissors Apocalypse wanted more though, so it gets a dedicated handler:

```python
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
```

We don't need to go through this code in details, but you should notice that this logic all references concepts that are specific to the game. This handler is not useful at all outside of Rock Paper Scissors. But for that one game it's great, because we get to track people's weapon selections across every multi-player game they play.

This is why we registered this specific handler against the product ID for Rock Paper Scissors Apocalypse, as discussed earlier.

### Workers

Workers are back! 

The stats tracker only has a single worker type - an event worker. 

The implementation of Workers is the exact same as the Matchmaker. In fact it is the same code, just duplicated across both locations.

!!! note
    You might be thinking 'but that's a terrible idea - why have the same code in two places?' and you would be right to think that. This will be the focus of a future `refactoring` task for you.

The stats tracker does add some specialization though. It needs to listen for some different events.

```python
if event_data.get(b"type", None) == b"game_over":
    logging.info(f"Processing Stream Event: {event_data}")
    product_id = event_data[b"product_id"].decode("utf-8")
    winner_id = event_data[b"winner_id"].decode("utf-8")
    loser_id = event_data[b"loser_id"].decode("utf-8")
    record_result(product_id, winner_id, loser_id)
    processed_event_count += 1

if event_data.get(b"product_id", None) is not None:
    product_id = event_data[b"product_id"].decode("utf-8")
    track_event(
        product_id,
        {
            a.decode("utf-8"): b.decode("utf-8")
            for a, b in event_data.items()
        },
    )
```

The above code sample comes from `stats_tracker/workers/event_stream_workers.py`.

This is where the worker decides if it needs to call `record_result` to update a leaderboard, which it does by checking if the event is a `game_over` type event.

It also decides whether to call `track_event` in our player_stats package. If there is a `product_id` field specified we will attempt to track the events. 

In both cases it's up to the handlers we discussed earlier how to handle the data coming from the event. They might decide to do nothing with it or they might decide to save information to the database.

That's all implementation specific.

## Running the tests

At this point I think it's a good idea you to figure out this part on your own.

The commands are all the same as for the Matchmaker, and the Game Portal server before that. 

You need to build and run a test image then run the tests, coverage and type checking.