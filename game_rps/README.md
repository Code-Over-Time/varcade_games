#### Code Over Time

This project is part of `Code Over Time`. For more information visit the [Code Over Time](http://www.codeovertime.com) website.

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

## Project Setup

### Clone the repo

First clone the repo for the RPS Apocalypse game client and game server:

```
git clone https://github.com/theblacknight/game_rps.git 
```

If you haven't already, clone the Build Tools project into the same directory as the RPS Apocalypse source.

```
git clone https://github.com/theblacknight/build_tools.git 
```

### Build and run the images

Next we will build and run the required images for Varcade Games.

```
cd build_tools
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

Follow the instructions from the [Varcade Games repo](https://github.com/theblacknight/website) to get the website set up.

Once you've got that up and running you can add a new game via the admin panel and enter the following values:

* Game id: exrps
* Name: Rock Paper Scissors Apocalypse
* Desc: A fun but intense online multi player version of the classic game Rock Paper Scissors
* Client url: http://localhost:8090/main.js
* Cover art: Upload the file `exrps_cover.png` from `game_rps/client/assets/`
* Game type: MultiAndSinglePlayer
* Game State: Active

Refresh the Varcade games page to see your new game.

On the game page you'll notice there is a `player stats` section and a `leaderboard` section. 

Both are empty however.

Also, now when you click `multi player` in the game menu you see a new piece of UI. This is the Varcade Games matchmaker.

We will need to set up two additional projects to get all of this working properly.

### Matchmaker

Follow the instructions over at the [Matchmaker repo](https://github.com/theblacknight/matchmaker) to get that service running.

Once you've got the matchmaker running you should be able to play multi-player games. However, because of how Varcade Games does authentication, you can no longer just open multiple tabs to test two accounts playing against eachother. 

Instead open up a private browsing window for player two.

### Stats Tracker

The `Stats Tracker` service is what calculates and serves the data for the `player stats` and `leaderboard` section of the Varcade Games game page.


Follow the instructions over at the [Stats Tracker repo](https://github.com/theblacknight/game_stats) to enable this functionality.