Back when you being introduced to the matchmaker you saw some diagrams that spoke of Redis Streams and Events.

You were told the Matchmaker consumes data from an event stream and uses that data to move games around between the pending, lobby and active sets.

The `Matchmaker Worker` is what is responsible for all of this.

It is another application, distinct from our server code but using the same codebase, that we run on it's on server whose only job is to process these events.

## Entry Point

Our Matchmaker Worker is just a Python process running on a Linux container.

A worker can be started by running the code in `matchmaker/game_worker.py`.

Most of the code in there is processing application args, setting up logging and metrics.

The bits we're interested in are:

```python
    worker_manager = WorkerManager()  # 1. Create worker manager
    worker_manager.register_worker(GameCurationWorker(config))  # 2. Add worker
    worker_manager.register_worker(
        GameEventWorker(config.EVENT_STREAM_URL)
    ) # 3. Add another one

    <snip>

    logging.info("Starting worker main loop...")
    while not sigHandler.terminate:  # 4. Loop until terminate signal is received
        events_processed = 0
        with s.time():
            events_processed = worker_manager.run_workers()  # 5.Run workers
        c.inc(events_processed)
    logging.info("Termination signal received - stopping worker")
```

All we're doing here is creating an instance of something called a 'WorkerManager', adding some 'workers' to it and then running an infinite loop (until a terminate signal is received) and telling the 'worker manager' to 'run workers'.

Lets run through the code, following the numbered comments:

1. 'WorkerManager' is a custom class. It manages a collection of 'Worker' objects.
2. Here we add a 'GameCurationWorker' to our WorkerManager. It's job is to look through the Pending, Lobby and Active sets to see if it needs to clean up any old or expired games. For example, a player may create a game but not join, which would leave that game sitting in the pending set forever.
3. Here we add a 'GameEventWorker'. This worker listens for game events, specifically the 'creator_joined', 'all_players_joined' and 'game_over' events. It uses these events to update Matchmaker game data so that it has an accurate picture of the current game state.
4. We run a loop until the application is closed.
5. In this loop we call a method 'run_workers' of our worker manager. This method loops through all registered workers and runs their code.

So essentially all this program does is call a set of functions over and over and over and over until the application is forcefully closed.

The code for our workers is in `matchmakers/workers`.

## The Worker code

The WorkerManager itself is very simple. Open up `worker_manager.py`.

The first thing you'll find is an interface:

```python
class AsyncWorker:
    """Base class that needs to be implemented in order for an object to be registered
    with the Worker Manager.
    """

    def run(self):
        raise NotImplementedError()

    def get_name(self):
        raise NotImplementedError()
```

As the docstring says, in order for a worker to be registered with our WorkerManager it needs to implement a 'run' method and a 'get_name' method.

The WorkerManager itself only has two methods:

* register_worker
* run_workers

Registering a worker adds it to a list. Calling `run_workers` iterates over that list calling the 'run' method of the worker. 

### Game Curation

Open up `game_management_workers.py`. This is where our Game Curation Worker lives.

The method we're most interested in is:

```python
    def purge_expired_games(self, product_id, batch_size=10) -> int:
        """Remove any games from the pending/lobby/active sets that have been
        inactive for too long.

        The oldest games are read from the three sets and deleted if the 'is_expired'
        property of the game object returns True.

        product_id (str):The ID of the product whose games are being cleaned up
        batch_size (int):The number of games to process on each run
        """
        purged_game_count = 0
        for game_id in self.dao.get_oldest_pending_games(
            product_id, result_set_size=batch_size
        ):
            if self.purge_game_if_expired(product_id, game_id):
                purged_game_count += 1

        for game_id in self.dao.get_oldest_lobby_games(
            product_id, result_set_size=batch_size
        ):
            if self.purge_game_if_expired(product_id, game_id):
                purged_game_count += 1

        for game_id in self.dao.get_oldest_active_games(
            product_id, result_set_size=batch_size
        ):
            if self.purge_game_if_expired(product_id, game_id):
                purged_game_count += 1
        return purged_game_count

```

The code should be pretty self explanatory.

It reads the oldest entries from from the Pending, Lobby and Active sets, checks if they have expired and purges them from the DB if they have.

Each set has an expiry time that is configurable (see `STATE_EXPIRY` in `matchmaker/game_data/models.py`). For example, a pending game will expire if the creator doesn't join within 60 seconds of creating it. Once the creator has joined their game will expire if no other player joins for 10 minutes.

This worker's job is to keep our database nice and clean.

### Game Events

The Game Event worker is another place in which the Matchmaker interfaces with the actual games that are using it. 

We saw earlier that our Matchmaker server will send HTTP requests to the game servers to create, join and remove games. But now the Matchmaker needs to listen to what is going on with the game servers, rather than issuing requests to them.

Our Game Event worker is a bit more complex.

It is reading events directly from a Redis Stream and depending on the event it will perform certain actions.

```python
if event_data.get(b"type", None) == b"state_change":
    logging.info(f"Processing Stream Event: {event_data}")
    self.update_game_state(
        event_data[b"product_id"].decode("utf-8"),
        event_data[b"game_id"].decode("utf-8"),
        event_data[b"new_state"].decode("utf-8"),
    )
    processed_event_count += 1
elif event_data.get(b"type", None) == b"game_removed":
    self.handle_game_removal(
        event_data[b"product_id"].decode("utf-8"),
        event_data[b"game_id"].decode("utf-8"),
    )
    processed_event_count += 1
elif event_data.get(b"type", None) == b"player_disconnect":
    self.handle_player_disconnect(
        event_data[b"product_id"].decode("utf-8"),
        event_data[b"game_id"].decode("utf-8"),
        event_data[b"player_id"].decode("utf-8"),
    )
```

It cares about three events:

* state_change
* game_removed
* player_disconnect

#### State Change

The Matchmaker maintains it's own internal state for games:

```python
# The game has been created
CREATED = "created"

# The creator of the game has joined the game
# on the actual game server. Other players can
# now join.
CREATOR_JOINED = "creator_joined"

# All required players have now joined. This signifies
# that the game can be started
ALL_PLAYERS_JOINED = "all_players_joined"

# The game is in progress - the duration will vary from
# game to game
IN_PROGRESS = "in_progress"

# The game has ended
ENDED = "ended"
```

We've talked about all of these states already. The game server sends out state_change events that the matchmaker uses to updates it's own state.

Any game that wants to hook into the matchmaker should send these events. 

This worker will also take more specific action when the state changes to CREATOR_JOINED'. At this point the game needs to move to the Lobby set from the Pending set.

#### Game Removed

This event is a notification from the game server to say a game has been removed from the game server.

The worker will try to remove any records of the game that it currently has.

#### Player Disconnect

In this case a non-host disconnected from an active game. Our worker needs to respond by placing the game back in the Lobby set so that they can try join again, or allow someone else to join.

## Working with the Workers

From your `build_tools` directory run:

```bash
make ps
```

You should see something like:

```bash
        Name                      Command                State                         Ports                     
-----------------------------------------------------------------------------------------------------------------                                              
game-portal            /bin/sh -c gunicorn game_p ...   Up         0.0.0.0:8000->8000/tcp                        
game-portal-client     docker-entrypoint.sh npm r ...   Up         0.0.0.0:8002->8002/tcp                        
game-rps               docker-entrypoint.sh /bin/ ...   Up         0.0.0.0:8080->8080/tcp, 0.0.0.0:8085->8085/tcp
game-rps-client        docker-entrypoint.sh /bin/ ...   Up         0.0.0.0:8090->8090/tcp                        
gameportaldb           docker-entrypoint.sh mysqld      Up         0.0.0.0:3306->3306/tcp, 33060/tcp             
grafana                /run.sh                          Up         0.0.0.0:3001->3000/tcp                        
matchmaker             /bin/sh -c gunicorn --relo ...   Up         0.0.0.0:5050->5050/tcp                        
matchmaker-worker      /bin/sh -c python game_wor ...   Up         0.0.0.0:5051->5051/tcp                        
prometheus             /bin/prometheus --config.f ...   Up         0.0.0.0:9090->9090/tcp                        
redis-db               docker-entrypoint.sh redis ...   Up         0.0.0.0:6379->6379/tcp                        
stats-tracker          /bin/sh -c gunicorn --relo ...   Up         0.0.0.0:5000->5000/tcp                        
stats-tracker-worker   /bin/sh -c python stats_wo ...   Up         0.0.0.0:5002->5002/tcp 
```

The line we're interested in now is:

```bash
matchmaker-worker      /bin/sh -c python game_wor ...   Up         0.0.0.0:5051->5051/tcp    
```

This is the container that is running our Matchmaker worker.

!!! Note
    Note that there is a port exposed on this container `0.0.0.0:5051->5051/tcp`. This isn't our worker exactly, it is a metrics server that were using to share metrics about the worker so that we can monitor its performance.

All the usual commands work for this container:

```
make logs a=matchmaker-worker
make build a=matchmaker-worker
make start a=matchmaker-worker
make restart a=matchmaker-worker
make stop a=matchmaker-worker
```

### Tests

You have already run the tests for the workers. Since our worker and server live in the one codebase, everything you did in the last section around running tests, coverage and type checking was also covering the worker code.

***

You've now go enough information about the Matchmaker system to go exploring and hopefully make some sense of it all.

There will be may more courses on this stuff available on [codeovertime.com](https://codeovertime.com), so don't worry if this part is hard to follow. The onboarding course is just meant to get everything up and running with a general understanding of how it all works.

Just enough so that you know where to look and what you need to learn.