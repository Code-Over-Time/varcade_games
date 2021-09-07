# RPS Game Engine

The `game_engine` library contains all of the game data and game play logic for `Rock Paper Scissors Apocalypse`.

Client of this library can create a game, add players, select characters and then `tick` that game so that it progresses through several rounds.

The game engine itself fires a number of events that client can listen in to in order to understand how the game is progressing.

This `game engine library` can be built and imported as a `node dependency` into both the client and the server projects, meaning that the exact same game logic is used for both single player and multi-player game play.

## Working with the engine

### Game Data

The `game_data.js` file contains all of the character information for the game. This includes stats, single player flow and various settings.

It also contains the game lore, credits and various other bits of static data required to run the game

### Core Classes

**RPSGame** is the main class through which game interactions happen. 

**RPSPlayer** is the base class of all players, which includes the currently active players, online players and single player bots.

**RPSRound** represents a single round in a game of rock paper scissors. A game consists of multiple rounds. The player that wins the most rounds wins the game (ie. winning 2 out of 3)

**RPSGameMode** [RPSGameMode.SINGLE or RPSGameMode.MULTI] - specifies whether this game will be single-player or multi-player. This is not used internally by the game engine, but is a useful flag for the game client so that it can manage in game scene changes.

**RPSFighter** represents an in game character.

**RPSRoundEvent** are game events specific to rounds that fire during game player. For example:

* ROUND_COUNTDOWN - Event that counts down the beginning of each round
* WEAPON_COUNTDOWN - Event that counts down weapon selection
* STATE_CHANGE - The state of the game has changed
* WEAPONS_SELECTED - All players have select their 'weapons' (ie. rock, paper, scissors)
* ROUND_FINISHED - A round ended
* ROUND_STARTED - A round started

**RPSGameEvent**  are events that relate to the overall game, for example:

* GAME_STARTED - The game has started
* FIGHTER_SELECTED - A player has selected a fighter
* PLAYERS_READY - Both players have selected fighters and are ready to fight
* GAME_COMPLETE - The game has finished

### Creating a game

You can create a single-player game as follows:

```
import { RPSGame, RPSGameMode } from 'rps-game-engine'

const numberOfRounds = 3
const rpsGame = new RPSGame(numberOfRounds, RPSGameMode.SINGLE)
```

There is no material different between a multi-player and single-player game as far as the engine is concerned. It simply runs a game, and as mentioned before the `RPSGameMode` parameter is simply a flag for clients of the engine.

The RPSGame instance exists in one of the following states:

* WAITING_FOR_PLAYERS - Waiting to players to join the game
* CHARACTER_SELECTION - Waiting for players to select their fighters
* IN_PROGRESS - Game is in progress
* GAME_OVER - Game has finished

### Adding players

```
import {
  RPSGame, RPSPlayer, RPSStrategyBot, RPSGameMode
} from 'rps-game-engine'

const numberOfRounds = 3
const rpsGame = new RPSGame(numberOfRounds, RPSGameMode.SINGLE)
rpsGame.addPlayer(new RPSPlayer('player'))

const botDifficulty = 1
rpsGame.addPlayer(new RPSStrategyBot('computer', botDifficulty))
```

This code creates a game that consists of a single human player (RPSPlayer) an `RPSStrategyBot`. This is a bot that follows some basic strategies to play Rock, Paper, Scissors.

The is also an `RPSRandomBot` - which simple makes random selection. Random bot is the hardest bot to play against, and so is used for the final boss in the game.

### Selecting fighters

```
import {
  RPSGame, RPSPlayer, RPSStrategyBot, RPSGameMode,
  RPSFighter, getCharacterById
} from 'rps-game-engine'

const numberOfRounds = 3
const rpsGame = new RPSGame(numberOfRounds, RPSGameMode.SINGLE)
rpsGame.addPlayer(new RPSPlayer('player'))

const botDifficulty = 1
rpsGame.addPlayer(new RPSStrategyBot('computer', botDifficulty))

const p1CharacterSelection = getCharacterById('lia')
const p2CharacterSelection = getCharacterById('man')

rpsGame.player1.selectFighter(new RPSFighter(p1CharacterSelection))
rpsGame.player2.selectFighter(new RPSFighter(p2CharacterSelection))
```

### Starting the game

Once players have been added to the game, it needs to be `started` and then `ticked` to progress gameplay.

```
import {
  RPSGame, RPSPlayer, RPSStrategyBot, RPSGameMode,
  RPSFighter, getCharacterById
} from 'rps-game-engine'

const numberOfRounds = 3
const rpsGame = new RPSGame(numberOfRounds, RPSGameMode.SINGLE)
rpsGame.addPlayer(new RPSPlayer('player'))

const botDifficulty = 1
rpsGame.addPlayer(new RPSStrategyBot('computer', botDifficulty))

const p1CharacterSelection = getCharacterById('lia')
const p2CharacterSelection = getCharacterById('man')

rpsGame.player1.selectFighter(new RPSFighter(p1CharacterSelection))
rpsGame.player2.selectFighter(new RPSFighter(p2CharacterSelection))

rpsGame.startGame()

tickTimer = setInterval(() => {
  if (!this.paused) {
    rpsGame.tick()
  }
}, 1000)
```

Here we start the game and then set an interval that will call `rpsGame.tick` once every second.

Changing the interval for the tick will results in faster/slower gameplay.

### Game Events

Event listeners can be added to RPSGame objects to listen for events of type RPSRoundEvent or RPSGameEvent.

All game event inherit from RPSEvent:

```
class RPSEvent {
  constructor (eventType, eventData) {
    this.type = eventType
    this.data = eventData
  }
}
```

#### Events and Event Data

##### RPSRoundEvent Configuration

ROUND_COUNTDOWN

```
/**
  Event that counts down to the beginning of a round. 3 -> 2 -> 1
**/
{
  value: <number>
}
```

WEAPON_COUNTDOWN

```
/**
  Event that counts weapon selection time. 3 -> 2 -> 1
**/
{
  value: <number>
}
```
 
STATE_CHANGE

```
/**
  The state of the game has changed.
**/
{
  newState: <enum:GameStates>,
  oldState: <enum:GameStates>
}
```

WEAPONS_SELECTED

```
/**
  Weapons have been selected and attack damage done
**/
{ 
  attackResult: <object:RPSWeaponSelections> 
}
```

ROUND_FINISHED

```
/**
  The current round has finished
**/
{
  roundWinnerId: <string>,
  roundLoserId: <string>
}
```

ROUND_STARTED

```
/**
  A new round has started
**/
{}
```

##### RPSGameEvent Configuration

GAME_STARTED

```
/**
  Game state has just changed to `IN PROGRESS`
**/
{}
```

GAME_COMPLETE

```
/**
  The game has finished and a winner has been decided
**/
{
  winnerId: <string>,
  loserId: <string>
}
```
