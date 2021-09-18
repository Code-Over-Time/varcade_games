# Game Portal

## Core Technologies Used

* [Django](https://www.djangoproject.com/)
* [Django rest framework](https://www.django-rest-framework.org/)
* [MySQL](https://www.mysql.com/)
* [Vue.js](https://vuejs.org/)

## Related Projects

This project contains everything you need to run `Varcade Games`, including a basic matchmaker, stats tracking and a sample game.

## Project Setup

For most use cases you will want to follow the [main README](/varcade_games/README.md) to get the entire project running.

### Build and run the images

If you just want to run the Varcade Games website you can run the following commands from the `build_tools` directory:

```
make build a=game-portal
make build a=game-portal-client
make start a=game-portal
make start a=game-portal-client
```

You can check the status of the applications (a Mysql and Redis image will also be started) at any time by running:

```
make ps
```

You can view the log output for the client and server at any time by running `make logs` from within the build tools directory.

Or individually by running:

```
make logs a=game-portal
```

or 

```
make logs a=game-portal-client
```