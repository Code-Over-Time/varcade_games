# Rock Paper Scissors Apocalypse!

`Rock Paper Scissors Apocalypse` is a single and multi player fighting game based around rock paper scissors.

Players choose a warrior and face off against a gauntlet of opponents, with only the best able to reach the final boss.

This game was built using [Phaser 3](https://github.com/photonstorm/phaser) for the client side and [NodeJS](https://nodejs.org/en/) for the server side.

## Core Technologies Used

* [Phaser 3](https://phaser.io/phaser3)
* [node.js](https://nodejs.org/)
* [Redis](https://redis.io/)
    * [Redis Streams](https://redis.io/topics/streams-intro)

## Project Structure

This project contains a `client` and `server` project, along with a core `game_engine` that is built and shared with both the game client and server.

The server is built with node.js and the client is built with Phaser 3 - a popular and full featured 2d javascript game engine.

### Build and run the images

If you want to just run the Game Client host (container that the game client is served from) and Game Server you can run the following commands from the `build_tools` directory:

```
make build a=game-rps
make build a=game-rps-client
make start a=game-rps
make start a=game-rps-client
```

You can check the status of the applications at any time by running:

```
make ps
```

You can view the log output for the client and server at any time by running `make logs` from within the build tools directory.

Or individually by running:

```
make logs a=game-rps
```

or 

```
make logs a=game-rps-client
```

### Playing the game

Navigate your browser to `locahost:8090` to open the test game page.

The game should load automatically.

If you select `single player` you will enter the story mode, but if you select `multi player` some new options will appear on the web page.

Enter a user name and click `Select Name`. Then enter a game ID - this can be any string value and click create game.

As soon as you create the new game the 'character select' screen will load. Once you select a character the game will wait for an opponent to join.

To simulate another player joining you will need to open a new tab and load the page again, give yourself a different user name and select the game you created.


## Integrating with Varcade Games

### Varcade Games

Assuming you have Varcade Games up and running, you can add `Rock Paper Scissors Apocalypse` via the admin panel. Enter the following values:

* Game id: exrps
* Name: Rock Paper Scissors Apocalypse
* Desc: A fun but intense online multi player version of the classic game Rock Paper Scissors
* Client url: http://localhost:8090/main.js
* Cover art: Upload the file `exrps_cover.png` from `game_rps/client/assets/`
* Stats config: Upload the file `exrps_stats.json` from `game_rps/client/assets/`
* Game type: MultiAndSinglePlayer
* Game State: Active

Refresh the Varcade Games game list page to see your new game.

Once the game is added you will have access to new functionality in the Game Portal.

### Matchmaker

Just adding the game via the admin panel will give you access to the multi-player and the matchmaker.

Note: Because of how Varcade Games manages authentication, you can not just open multiple tabs to test two accounts playing against eachother - both tabs will be logged into the same account. 

Instead open up a private browsing window for player two.

### Stats Tracker

The `Stats Tracker` service is what calculates and serves the data for the `player stats` and `leaderboard` section of the Varcade Games game page. 

This data will be populated after you've played a multi-player game.