The `Game Engine` is a combination of all of the game data and game logic for Rock Paper Scissors Apocalypse.

It is a library that can be run in a browser **or** on a server - enabling multi-player gameplay.

The game characters are defined here, as are the rules of the game and the execution of the game.

In this section we'll have a quick look at some of the important elements of the engine.

## Game Data

Open up `game_engine/src/game_data.js`. 

The contents of this file should be immediately familiar. It's all of the character information you've seen in the game UI.

Here's the first entry in the character list:

```js
const characters = [
  {
    id: 'aru',
    displayName: 'Aruka',
    country: 'Brazil',
    stats: {
      health: 100,
      style: 'paper',
      rock: {
        baseDamage: 25,
        damageModifier: 0,
        damageMitigation: 0.2
      },
      paper: {
        baseDamage: 25,
        damageModifier: 0.30,
        damageMitigation: 0
      },
      scissors: {
        baseDamage: 25,
        damageModifier: 0,
        damageMitigation: 0
      }
    },
    singlePlayerSequence: [
      'man', 'rad', 'hog'
    ],
    locked: false,
    isBoss: false,
    singlePlayerUnlock: 'hog',
    storyline: [
      'As humanity stood face to face with the darkest evil it had ever encountered, the indigenous warriors of the Amazon were some of the first to stand in its path.\n',
      'Many believe that the spirit of mother nature flows through Aruka and guides him against the forces of darkness.\n',
      'His intuition of all things natural, be they creative or destructive forces, makes Aruka a natural RPS contender. During battle he enters a trance-like state, through which his focus and composure is unwavering.'
    ],
    trashTalk: {
      win: ['The forest will always prevail...'],
      lose: ['There is no good that lasts forever nor evil that never ends.']
    }
  }
  ...
```

Some interesting fields here are:

```js
singlePlayerSequence: [
  'man', 'rad', 'hog'
],
```

These are the IDs of the characters that Aruka will face during single player mode.

```js
locked: false,
```

This tell the game client whether the character should initially be displayed as locked. If this is true you will need to make sure that the character can be unlocked (see below).

```js
isBoss: false,
```

This is, and should only be, true for one of the characters. The boss is treated differently to other players and is only faced once the player defeats all of their opponents without losing a single round. Mainyu is our boss.

```js
singlePlayerUnlock: 'hog',
```

This entry tells us what character to unlock when this character successfully defeats every opponent in their `singlePlayerSequence`.

Not every character unlocks another character, so this can be null.

Try playing around with some of these settings and see what happens.

## Game Models

This is where we define the various different game objects that we will use to represent players in the game, along with their characters and weapon selections.

Most of these classes should be fairly self-explanatory. One thing to note is the `RPSFighter`:

```js
class RPSFighter {
  /**
   *  Represents the player's character selection.
  **/
  constructor (spec) {
    this.id = spec.id
    this.spec = spec
    // Amount of damage this fighter has taken in the current round
    this.damage = 0

    this.weapons = [
      new Rock(this.spec.stats.rock.baseDamage, {
        damageModifier: this.spec.stats.rock.damageModifier,
        damageMitigation: this.spec.stats.rock.damageMitigation
      }),
      new Paper(this.spec.stats.paper.baseDamage, {
        damageModifier: this.spec.stats.paper.damageModifier,
        damageMitigation: this.spec.stats.paper.damageMitigation
      }),
      new Scissors(this.spec.stats.scissors.baseDamage, {
        damageModifier: this.spec.stats.scissors.damageModifier,
        damageMitigation: this.spec.stats.scissors.damageMitigation
      })
    ]

    this.currentSelectedWeaponIndex = null
    // True if the current round is accepting weapon selection from players
    this.weaponSelectAvailable = false
  }
```

In it's constructor it loads stats from `game_data.js`. So we can balance the characters strengths and weaknesses from the data file. Or in other words - it's **data driven**.

A couple of other interesting classes in this file are our bots:

```js
class RPSStrategyBot extends RPSPlayer {
  /**
   *  Represents an AI player (single player mode)
   *  that uses some basic strategy, as defined in
   *  strategy.js
  **/
  constructor (id, difficulty) {
    super(id)
    this.strategy = getStrategy(difficulty)
  }

  eventListener (event) {
    if (event instanceof RPSRoundEvent) {
      if (event.type === RPSRoundEvent.WEAPON_COUNTDOWN && event.data.value === 2) {
        this.fighter.equipWeapon(this.strategy.getNextSelection(this.fighter.getCurrentHealthPct()))
      }
      if (event.type === RPSRoundEvent.ROUND_FINISHED) {
        this.strategy.reset()
      }
    }
  }
}

class RPSRandomBot extends RPSPlayer {
  /**
   *  Represents an AI player (single player mode)
   *  that simply makes random selection -
   *  !Note! This is one of the most difficult to play against
  **/
  eventListener (event) {
    if (event instanceof RPSRoundEvent) {
      if (event.type === RPSRoundEvent.WEAPON_COUNTDOWN) {
        this.fighter.equipWeapon(Math.floor(Math.random() * 3))
      }
    }
  }
}
```

The `RPSRandomBot` is used to create a single player enemy that will just make random selections. This is the hardest type of opponent to play against - so this is used by the final boss.

The `RPSStrategyBot` is a little different. This object is used to create a single player enemy that plays according to strategies of varying difficulty.

Our AI will always use some repeating pattern. The strategy difficulty dictates how difficult the pattern is to detect and whether the AI will change strategy after taking a certain amount of damage.

These are used during single player to create a set of opponents that increase in difficulty as the player progresses.

## Game Play

Open up `game_engine/src/game_play.js`.

This is there the actual game happens.

There is a class called `RPSGame`. This is class is essentially a state management system.

### Game States 

A game have a number of states it can be in:

```js
class RPSGameStates {
  static get WAITING_FOR_PLAYERS () { return 0 }
  static get CHARACTER_SELECTION () { return 1 }
  static get IN_PROGRESS () { return 2 }
  static get GAME_OVER () { return 3 }
}
```

#### WAITING_FOR_PLAYERS

The game has been created and is now waiting for players to be added.

#### CHARACTER_SELECTION

The game is now waiting for the players to make their character selection.

#### IN_PROGRESS

The game is in progress.

#### GAME_OVER

The game has ended.

### Rounds

Once a game is in progress it is represented as a series of rounds. A player must win two rounds to win the game. Therefore the minimum number of rounds is 2 and the maximum is 3.

Rounds are have a number of states that they progress through during gameplay:

```js
  static get NEW_ROUND () { return 0 }
  static get COUNTDOWN () { return 1 }
  static get WAITING_FOR_WEAPON_SELECTION () { return 2 }
  static get PROCESSING_RESULT () { return 3 }
  static get FINISHED () { return 4 }
```

#### NEW_ROUND

The round has been created.

#### COUNTDOWN

The 'start of round' countdown is in progress.

#### WAITING_FOR_WEAPON_SELECTION

Players can make their weapon selections.

#### PROCESSING_RESULT

The result of the player's selection are being processed.

#### FINISHED

The round has finished.

A round will enter a cycle of going from WAITING_FOR_WEAPON_SELECTION to PROCESSING_RESULT until the game detects that a player has reached zero health, at which point it will progress to the FINISHED state.

## Tick

So as you can see there is a logical progression of states that happens in order to make the game run.

This progression is very similar in code to what the player experiences:

Start game -> Select character -> Start battle -> start round -> select weapon -> Apply damage -> Repeat until health is zero -> End round -> Repeat until one player wins two rounds.

But what is actually running this progression?

That would be our game `tick`. 

The `RPSGame` object has a method:

```js
tick () {
    this.stateHandlers[this.state]()
  }
```

This method calls a `state handler`, which will behave differently depending on the current state of the game.

This tick can be called at any desired interval. When the server is running the game it calls 'tick' every second. Single player mode calls it every half second.

The speed of the game is based on the tick, because the tick is simply what causes our game states to change from one state to the next.

If you want to play with this yourself, open up `game_rps/client/src/game_engine_interface.js` and find the line:

```js
console.log('Single player game - starting client side tick loop...')
    this.tickTimer = setInterval(() => {
      if (!this.paused) {
        this.game.tick()
      }
    }, 500)
```

That `500` is the 500 millisecond tick for single player. If you increase that value your single player game will run slower. Decrease it and it will run faster.

***

That's about as deep as I want to go into the game for this onboarding course. 

Next we will look at the game design - understanding the gameplay will help you reason about the code.