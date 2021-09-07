# Varcade Games Server

The `server` project contains contains all of the code for building and deployng the Varcade Games server.

The actual Django project is referred to as the `game_portal`, as Varcade Games is an online portal for hosting browser based games.

## Working with the Varcade Games Server

The `game_portal` project consists of three Django apps:

* accounts
* games
* profiles

### accounts

We create our own custom `User` model in `accounts.models`. This is done primarily for future extension, something that the Django project recommends.

We also have custom player registration handling in order to support using [JWT](https://jwt.io/) for authorization (this allows us to use the same token across multiple services, ie. the matchmaker can accept the same auth token as the game portal).

This custom logic is in `accounts.serializers` and `accounts.views`.

### games

The `games` app contains all of the code and logic for registering and managing games within the `game_portal`.

It also provides and interface for requesting leaderboards and player stats for those games.

### profiles

The `profiles` app is a simple user profile to tracking public facing player profile information, like player level, XP, location etc...

### Running the tests

Tests for the server project can be run inside a dedicated container.

First run the build make command from within the `website/server` directory.

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