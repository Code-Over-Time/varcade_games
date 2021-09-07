# Stats Tracker

Welcome to the Stats Tracker project!

The Stats Tracker is responsible for listening to game events and using those events to build and maintain leaderboards and player stats.

Both the leaderboard system and player stats system is designed to be pluggable so that different games can provide custom handling for leaderboard scoring (for example a game may want to use an [Elo](https://en.wikipedia.org/wiki/Elo_rating_system] scoring system) and can dictate what stats are tracked (this will generally vary from game to game).

This project provides both an API to query leaderboard and stats data, as well as a set of workers that process events in order to populate the system with data.

## Core Technologies Used

* [Python 3.8](https://www.python.org/downloads/release/python-383/)
* [Flask](https://flask.palletsprojects.com/en/1.1.x/)
* [Redis](https://redis.io/)
    * [Redis Streams](https://redis.io/topics/streams-intro)

## Project Setup

### Clone the repo

First clone the repo for the Stats Tracker.

```
git clone https://github.com/theblacknight/stats_tracker 
```

If you haven't already, clone the Build Tools project into the same directory as the Stats Tracker project.

```
git clone https://github.com/theblacknight/build_tools.git 
```

### Build and run the images

Next we will build and run the required images for Varcade Games.

```
cd build_tools
make build a=stats-tracker
make build a=stats-tracker-worker
make start a=stats-tracker
make start a=stats-tracker-worker
```

You can check the status of the applications (a Redis image will also be started) at any time by running:

```
make ps
```

You can view the log output for the client and server at any time by running `make logs` from within the build tools directory.

Or individually by running:

```
make logs a=stats-tracker
```

or 

```
make logs a=stats-tracker-worker
```

## Running the tests

The Stats Tracker tests can be run inside a dedicated container.

First run the build make command from within the `stats_tracker` directory.

```
make build_test_image
```

Once the build is done you can running it with the following command:

```
make run_test_image
```

To actually run the tests you can run:

```
make run_tests
```

When you run the test image the current directory is mounted on the container, which means you can make code changes and re-run the tests without having to rebuild the container.

You can also check the test coverage by running:

```
make run_coverage
```

And run type checking ([mypy](http://mypy-lang.org/)) by running:

```
make run type_checking
```

To clean everything up run:

```
make clean
```