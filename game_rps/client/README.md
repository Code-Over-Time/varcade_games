# RPS Game Client

The `client` project contains all of the code for building and running the Rock Paper Scissors Apocalypse game client.

This project includes the `game_engine` project as a dependency and uses webpack to build the actual client.

This is a standard [Phaser 3](https://phaser.io/phaser3) project.

## Working with the client

### Index

Phaser initialization happens in `src/index.js`. 

All of the scenes are registered here and the actual game object is created.

The `parent` entry in the Phaser config specifies the DOM element that the game client is attached to.

### Scenes

There are eight key scenes in `Rock Paper Scissors Apocalypse`:

* **MainMenuScene** - The first thing the player sees, contains gameplay (single/multi player) options and game setting
* **StoryIntroScene** - Displays the game lore for single player mode
* **CharacterSelectScene** - Character selection
* **CharacterIntroScene** - Displays character backstories for single player mode
* **VSScene** - Pre-fight VS screen that reveals to players their opponent 
* **BattleScene** - The main scene where the RPS battle actually takes place
* **PostFightScene** - Displays the winner and loser, with some trash talk
* **GameOverScene** - Displays game over result for single player along with credits, if the player beat the campaign

### Game Engine Interface

`game_engine_interface.js` is the file that controls all interactions between the game visuals and the game engine. 

This abstraction means that the rendering layer does not care whether a single or multi player game is being played, it's operating off the same inputs either way.

### Dev mode

When running the local dev mode version of the game (ie. running independently, no via the Varcade Games interface), `./index.html` is what is served.

It contains a `matchmaker` object that conforms to the interface of the Varcade Games matchmaker client, so that the same multiplayer flow can be tested in isolation.

From `build_tools` run `make start a=game-rps` and `make start a=game-rps-client` to run the game client and server. You can view the standalone client by navigating your browser to `localhost:8090`.
