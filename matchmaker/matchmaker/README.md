# Matchmaker Package

The matchmaker has multiple entry points:

* app.py - to run the matchmaker as an application server
* game_worker.py - to run the matchmaker background worker

### app.py

If this file is simply run with `python app.py` then it will start a development server.

It can also be run with `uWSGI` / `gunicorn` or any other [WSGI](https://wsgi.readthedocs.io/en/latest/index.html) compatible server. For example:

```
gunicorn --bind 0.0.0.0:5050 "app:create_app('$SERVER_MODE')"
```

The `server mode` variable can be set to one of [development|test|production].

This module will create a Flask app, initialize logging, create a connection to a Redis instance and other core server initialization steps.

### game_worker.py

The game worker runs an infinite loop that constantly checks for game events coming from a [Redis stream](https://redis.io/topics/streams-intro). It will also starts a Prometheus metrics server so that event processing metrics can be tracked.

The matchmaker worker can be run with the following command:

```
python game_worker.py -m [development|test|production]
```

## Configuration

`config.py` houses the configuration for the matchmaker.

## Packages

The matchmaker is composed of the following packages:

### core

The `core` package contains any thing central to the operation of the matchmaker.

This includes data models representing remote game servers that are registered with the matchmaker. 

The matchmaker will use this data to connect to game servers for different products and create new games or attempt to remove stale ones. This data also contains the game server socket URL that players will connect to in order to play the game. 

The core also contains the interface for connecting to those remote servers, see `core.game_server_api.py`.

### game_data

The `game_data` package contains all of the data models, validation, storage api and logic for creating games.

These games are the internal matchmaker representation of all player created games.

The matchmaker actively curates games, removing any games that have been inactive for a long time, or games that were created but never joined.

To do this the matchmaker keeps it's own internal generic representation of every game created. 

The matchmaker-worker listen for events coming from game servers in order to make decisions about whether to to clean up a game, or make it available publicly via the lobby.

This data is stored in Redis.

### lobby

The lobby is the public facing API for the matchmaker.

It uses the `game_data` API to create and manage games, and serve those games to players. 

Client of the matchmaker can use the lobby API to:

* Create new games
* Join existing games (provided the creator has already joined)
* Get a list of all 'open' games

### workers

The worker package containers all of the asynchronous workers that are responsible for managing the internal state of all matchmaker games.

These workers process game events in order to manage the state of all active games. They are also responsible for the curation of all active games. These curation workers will, for example, delete any game that has been created but not joined by the creator within N minutes.