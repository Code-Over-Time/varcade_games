# RPS Game Server

The `client` project contains all of the code for building and deploying the Rock Paper Scissors Apocalypse game server.

This project includes the `game_engine` project as a dependency and uses.

The game server uses [node.js](https://nodejs.org/)

## Working with the Game Server

The game server runs a [websocket](https://github.com/websockets/ws) server and an [Express HTTP server](https://expressjs.com/).

## Running the tests

Navigate to the root of the server project:

```
cd server
```

Then install the npm dependencies:

```
npm install
```

Now we can run the tests:

```
npm run test
```

## Running the linter

If you haven't already run the commands from the previous step, run:

```
cd server
npm install
```

And then:

```
npm run lint
```

Or if you want to automatically fix the lint issues:

```
npm run lint-fix
```