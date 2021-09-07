# Matchmaker

Welcome to the match maker project!

The Matchmaker is responsible for finding, creating, updating and deleting multi-player games. 

It also provides an asynchronous worker that processes a stream of events coming from various different game servers in order to keep its state up to date. 

The matchmaker is configurable, so new games can be easily added - provided they conform to the matchmaker API.

## Core Technologies Used

* [Python 3.8](https://www.python.org/downloads/release/python-383/)
* [Flask](https://flask.palletsprojects.com/en/1.1.x/)
* [Redis](https://redis.io/)
    * [Redis Streams](https://redis.io/topics/streams-intro)

## Project Setup

### Clone the repo

First clone the repo for the Matchmaker.

```
git clone https://github.com/theblacknight/matchmaker.git 
```

If you haven't already, clone the Build Tools project into the same directory as the Matchmaker source.

```
git clone https://github.com/theblacknight/build_tools.git 
```

### Build and run the images

Next we will build and run the required images for Varcade Games.

```
cd build_tools
make build a=matchmaker
make build a=matchmaker-worker
make start a=matchmaker
make start a=matchmaker-worker
```

You can check the status of the applications (a Redis image will also be started) at any time by running:

```
make ps
```

You can view the log output for the client and server at any time by running `make logs` from within the build tools directory.

Or individually by running:

```
make logs a=matchmaker
```

or 

```
make logs a=matchmaker-worker
```

## Running the tests

The Matchmaker tests can be run inside a dedicated container.

First run the build make command from within the `matchmaker` directory.

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