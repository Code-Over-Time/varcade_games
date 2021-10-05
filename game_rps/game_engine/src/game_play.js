const { RPSRoundResult, RPSWeaponSelections } = require('./game_models')
const { RPSGameEvent, RPSRoundEvent } = require('./game_events')

class RPSGameStates {
  static get WAITING_FOR_PLAYERS () { return 0 }
  static get CHARACTER_SELECTION () { return 1 }
  static get IN_PROGRESS () { return 2 }
  static get GAME_OVER () { return 3 }
}

class RPSGameMode {
  static get SINGLE () { return 0 }
  static get MULTI () { return 1 }
}

class RPSGame {
  constructor (numRounds, gameMode, id) {
    this.id = id
    this.numRounds = numRounds
    this.gameMode = gameMode
    this.rounds = []
    this.currentRound = null
    this.player1 = null
    this.player2 = null
    this.p1Wins = 0
    this.p2Wins = 0
    this.state = RPSGameStates.WAITING_FOR_PLAYERS
    this.eventListeners = []

    const numStates = Object.entries(Object.getOwnPropertyDescriptors(RPSGameStates))
      .filter(([key, descriptor]) => typeof descriptor.get === 'function')
      .map(([key]) => key).length
    this.stateHandlers = new Array(numStates)
    this.stateHandlers[RPSGameStates.WAITING_FOR_PLAYERS] = () => this.handleWaitingForPlayersState()
    this.stateHandlers[RPSGameStates.CHARACTER_SELECTION] = () => this.handleCharacterSelectionState()
    this.stateHandlers[RPSGameStates.IN_PROGRESS] = () => this.handleInProgressState()
    this.stateHandlers[RPSGameStates.GAME_OVER] = () => this.handleGameOverState()
  }

  /// /////////////////////////////////////////////////
  //
  //                GAME MGMT
  //
  /// /////////////////////////////////////////////////

  addEventListener (listener) {
    /**
     * Add an event listener that will receive RPSRoundEvents and RPSGameEvents.
    **/
    if (listener != null) {
      this.eventListeners.push(listener)
    }
  }

  addPlayer (player) {
    /**
     *  Add a RPSPlayer to the game. If no player 1 has been added, then
     *  the player arg will become player 1. Otherwise they will become
     *  player 2.
     *
     *  If both player 1 and player 2 have been set, the method does
     *  nothing and return false
     *
     *  returns true if the player was set, false otherwise
    **/
    if (!this.player1) {
      this.player1 = player
    } else if (!this.player2) {
      this.player2 = player
    } else {
      return false
    }
    if (this.player1 != null && this.player2 != null) {
      this.state = RPSGameStates.CHARACTER_SELECTION
    }
    return true
  }

  startGame () {
    /**
     *  Starts the game by setting its state to 'IN_PROGRESS'.
     *
     *  If either player 1 or player 2 is null the method return false.
     *
     *  Otherwise the method returns true and sends a 'GameStarted' event.
    **/
    if (!this.player1 || !this.player2) {
      return false
    } else if (!this.player1.ready() || !this.player2.ready()) {
      return false
    }
    this.state = RPSGameStates.IN_PROGRESS
    this.sendGameEvent(new RPSGameEvent(RPSGameEvent.GAME_STARTED, {}))
    return true
  }

  isInProgress () {
    return this.state === RPSGameStates.IN_PROGRESS
  }

  resetGame (preserveP1) {
    /**
     *  Resets the game back to it's initial state.
     *
     *  We can optionally preserve the Player 1 model,
     *  which is useful during multi-player if Player 2
     *  disconnects.
    **/
    this.rounds = []
    this.currentRound = null
    this.p1Wins = 0
    this.p2Wins = 0
    this.state = RPSGameStates.WAITING_FOR_PLAYERS

    this.player2 = null
    if (!preserveP1) {
      this.player1 = null
    } else {
      if (this.player1.fighter) {
        this.player1.fighter.reset()
      }
    }
  }

  /// /////////////////////////////////////////////////
  //
  //              GAMEPLAY PROGRESSION
  //
  /// /////////////////////////////////////////////////

  tick () {
    /**
     * Process and update game state
    **/
    this.stateHandlers[this.state]()
  }

  sendGameEvent (event) {
    for (let i = 0; i < this.eventListeners.length; i++) {
      this.eventListeners[i](event)
    }
  }

  /// /////////////////////////////////////////////////
  //
  //                STATE HANDLERS
  //
  /// /////////////////////////////////////////////////

  handleWaitingForPlayersState () {
    // no-op
  }

  handleCharacterSelectionState () {
    // no-op
  }

  handleInProgressState () {
    if (!this.currentRound) {
      // Create our first round lazily
      this.currentRound = this.createNewRound()
    }
    if (this.currentRound.state === RPSRoundStates.FINISHED) {
      this.processCurrentRound()
      return
    }
    this.currentRound.tick()
  }

  handleGameOverState () {
    this.sendGameEvent(new RPSGameEvent(
      RPSGameEvent.GAME_COMPLETE, {
        winnerId: this.currentRound.roundResult.winner.id,
        loserId: this.currentRound.roundResult.loser.id
      })
    )
  }

  /// /////////////////////////////////////////////////
  //
  //                ROUND MANAGEMENT
  //
  /// /////////////////////////////////////////////////

  processCurrentRound () {
    this.recordScoreAndSaveRound()
    const roundsToWin = Math.floor(this.numRounds / 2) + 1
    if (this.p1Wins >= roundsToWin || this.p2Wins >= roundsToWin) {
      this.state = RPSGameStates.GAME_OVER
    } else {
      this.player1.fighter.reset()
      this.player2.fighter.reset()
      this.currentRound = this.createNewRound()
    }
  }

  createNewRound () {
    return new RPSRound(
      this.player1,
      this.player2,
      3, // Count down the round from 3
      3, // Count down  weapon selection from 3
      (event) => this.sendGameEvent(event)
    )
  }

  recordScoreAndSaveRound () {
    if (this.currentRound.roundResult.winner === this.player1) {
      this.p1Wins += 1
    } else if (this.currentRound.roundResult.winner === this.player2) {
      this.p2Wins += 1
    }
    this.rounds.push(this.currentRound)
  }
}

class RPSRoundStates {
  static get NEW_ROUND () { return 0 }
  static get COUNTDOWN () { return 1 }
  static get WAITING_FOR_WEAPON_SELECTION () { return 2 }
  static get PROCESSING_RESULT () { return 3 }
  static get FINISHED () { return 4 }
}

class RPSRound {
  constructor (player1, player2, preWeaponSelectCountdown, weaponSelectCountdown, eventListener) {
    this.state = RPSRoundStates.NEW_ROUND
    this.roundResult = null
    this.player1 = player1
    this.player2 = player2
    this.preWeaponSelectCountdown = preWeaponSelectCountdown
    this.weaponSelectCountdown = weaponSelectCountdown
    this.currentPreWeaponSelectCount = preWeaponSelectCountdown
    this.currentWeaponSelectCount = preWeaponSelectCountdown
    this.processResultTickDelayCounter = 0
    this.eventListener = eventListener
    this.eventListener(new RPSRoundEvent(RPSRoundEvent.ROUND_STARTED))

    const numStates = Object.entries(Object.getOwnPropertyDescriptors(RPSRoundStates))
      .filter(([key, descriptor]) => typeof descriptor.get === 'function')
      .map(([key]) => key).length

    this.stateHandlers = new Array(numStates)
    this.stateHandlers[RPSRoundStates.NEW_ROUND] = () => this.handleNewRoundStartedState()
    this.stateHandlers[RPSRoundStates.COUNTDOWN] = () => this.handleRoundCountdownState()
    this.stateHandlers[RPSRoundStates.WAITING_FOR_WEAPON_SELECTION] = () => this.handleWeaponSelectionCountdownState()
    this.stateHandlers[RPSRoundStates.PROCESSING_RESULT] = () => this.handleWeaponsSelectedState()
    this.stateHandlers[RPSRoundStates.FINISHED] = () => this.handleRoundFinishedState()
  }

  /// /////////////////////////////////////////////////
  //
  //              ROUND MGMT
  //
  /// /////////////////////////////////////////////////

  reset () {
    this.currentPreWeaponSelectCount = this.preWeaponSelectCountdown
    this.currentWeaponSelectCount = this.preWeaponSelectCountdown
  }

  /// /////////////////////////////////////////////////
  //
  //              ROUND PROGRESSION
  //
  /// /////////////////////////////////////////////////

  tick () {
    this.stateHandlers[this.state]()
  }

  updateState (newState) {
    // TODO: Validate is valid transition
    const oldState = this.state
    this.state = newState
    this.eventListener(new RPSRoundEvent(
      RPSRoundEvent.STATE_CHANGE,
      {
        newState: newState,
        oldState: oldState
      }
    ))
  }

  /// /////////////////////////////////////////////////
  //
  //                STATE HANDLERS
  //
  /// /////////////////////////////////////////////////

  handleNewRoundStartedState () {
    this.updateState(RPSRoundStates.COUNTDOWN)
  }

  handleRoundCountdownState () {
    if (this.currentPreWeaponSelectCount <= 0) {
      this.openWeaponSelect()
      this.updateState(RPSRoundStates.WAITING_FOR_WEAPON_SELECTION)
    } else {
      this.eventListener(new RPSRoundEvent(
        RPSRoundEvent.ROUND_COUNTDOWN,
        {
          value: this.currentPreWeaponSelectCount
        }
      ))
      this.currentPreWeaponSelectCount -= 1
    }
  }

  handleWeaponSelectionCountdownState () {
    if (this.currentWeaponSelectCount <= 0) {
      this.closeWeaponSelect()
      this.processAttackResult()
      this.player1.fighter.currentSelectedWeaponIndex = null
      this.player2.fighter.currentSelectedWeaponIndex = null
      this.updateState(RPSRoundStates.PROCESSING_RESULT)
    } else {
      this.eventListener(new RPSRoundEvent(
        RPSRoundEvent.WEAPON_COUNTDOWN,
        {
          value: this.currentWeaponSelectCount
        }
      ))
      this.currentWeaponSelectCount -= 1
    }
  }

  handleWeaponsSelectedState () {
    if (!this.player1.fighter.isDefeated() && !this.player2.fighter.isDefeated()) {
      this.reset() // Reset the round countdowns for next weapon selection

      // Need to enable weapon select again here because the round countdown only happens once per round
      this.openWeaponSelect()

      // Delay the processing result state change by a few ticks so that
      // The UI can hold and display the result before progressing
      // Do based on tick so this delay scales with tick time
      this.processResultTickDelayCounter += 1
      if (this.processResultTickDelayCounter >= 2) {
        this.processResultTickDelayCounter = 0
        this.updateState(RPSRoundStates.WAITING_FOR_WEAPON_SELECTION)
      }
    } else {
      this.processRoundResult()
      this.updateState(RPSRoundStates.FINISHED)
      this.eventListener(new RPSRoundEvent(RPSRoundEvent.ROUND_FINISHED, {
        roundWinnerId: this.roundResult.winner.id,
        roundLoserId: this.roundResult.loser.id
      }))
    }
  }

  handleRoundFinishedState () {
    // no-op
  }

  /// /////////////////////////////////////////////////
  //
  //              RESULT PROCESSING
  //
  /// /////////////////////////////////////////////////

  openWeaponSelect () {
    this.player1.fighter.weaponSelectAvailable = true
    this.player2.fighter.weaponSelectAvailable = true
  }

  closeWeaponSelect () {
    this.player1.fighter.weaponSelectAvailable = false
    this.player2.fighter.weaponSelectAvailable = false
  }

  processAttackResult () {
    const selections = new RPSWeaponSelections(
      this.player1.fighter.getSelectedWeapon(),
      this.player2.fighter.getSelectedWeapon()
    )
    const attackSummary = selections.getSelectionSummary()
    this.player1.fighter.applyDamage(attackSummary.p2Selection.damageDealt)
    this.player2.fighter.applyDamage(attackSummary.p1Selection.damageDealt)

    this.eventListener(new RPSRoundEvent(
      RPSRoundEvent.WEAPONS_SELECTED, {
        attackSummary: attackSummary
      })
    )
  }

  processRoundResult () {
    let loser, winner
    if (this.player2.fighter.isDefeated()) {
      winner = this.player1
      loser = this.player2
    } else {
      winner = this.player2
      loser = this.player1
    }
    // In the case of a double KO, P1 wins
    this.roundResult = new RPSRoundResult(winner, loser)
  }
}

exports.RPSGame = RPSGame
exports.RPSGameMode = RPSGameMode
exports.RPSRoundStates = RPSRoundStates
