# Stats Tracker Package

The stats tracker has multiple entry points:

* app.py - to run the stats tracker as an application server
* stats_worker.py - to run the stats tracker background worker

### app.py

If this file is simply run with `python app.py` then it will start a development server listening on `0.0.0.0:5000`.

It can also be run with `uWSGI` / `gunicorn` or any other [WSGI](https://wsgi.readthedocs.io/en/latest/index.html) compatible server. For example:

```
gunicorn --bind 0.0.0.0:5050 "app:create_app('$SERVER_MODE')"
```

The `server mode` variable can be set to one of [development|test|production].

This module will create a Flask app, initialize logging, create a connection to a Redis instance and other core server initialization steps.

### stats_worker.py

The stats worker runs an infinite loop that constantly checks for game events coming from a [Redis stream](https://redis.io/topics/streams-intro). It will also starts a Prometheus metrics server so that event processing metrics can be tracked.

The stats tracker worker can be run with the following command:

```
python stats_worker.py -m [development|test|production]
```

The difference between the modes is the configuration that is used, see `config.py` to understand the difference between the configurations.

## Packages

The stats tracker is composed of the following packages:

### core

The core package provides low level functionality, such as database access.

### leaderboards

The leaderboards package provides APIs and utilities for working with leaderboards.

This includes the public facing APIs that clients will interact with and some game specific handlers for leaderboards, so that games can implement their own scoring logic for their leaderboards (eg. ELO).

### player_stats

The player_stats package provides APIs and utilities for working with player statistics.

Game specific events are processed by stats tracker workers and stored in the database. Game specific player stats handlers are also defined here, so that each game can track their own set of statistics (eg. number of games played, wins, losses etc...).

### workers

The worker package containers all of the asynchronous workers that are responsible for populating the stats_tracker DB with player information.

These workers process game events coming directly from game servers in order to build leaderboards and track game specific player statistics.