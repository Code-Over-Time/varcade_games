const RPSEngine = require('rps-game-engine')
const RPSErrors = require('./rps_errors')
const { GameplayEvent, StateChangeEvent, GameOverEvent, GameProgressEvent } = require('./event_stream')
const logger = require('./logger')

class MultiPlayerGame {
  constructor (token, gameId, userId, username, streamEventListener, gameOverListener) {
    this.id = gameId
    this.token = token

    // default state
    this.p1Connection = null
    this.p2Connection = null
    this.p1Ready = false // Variables used to sync the start of the actual battle
    this.p2Ready = false
    this.streamEventListener = streamEventListener
    this.gameOverListener = gameOverListener

    // Client message handling
    this.messageHandlers = {
      select_fighter: (conn, msg) => this.handleSelectFighter(conn, msg),
      start_battle: (conn, msg) => this.handleStartBattle(conn, msg),
      select_weapon: (conn, msg) => this.handleSelectWeapon(conn, msg)
    }

    // Game engine configuration
    this.game = new RPSEngine.RPSGame(3, RPSEngine.RPSGameMode.MULTI, gameId)
    this.game.addPlayer(new RPSEngine.RPSOnlinePlayer(userId, username))
    this.game.addEventListener((event) => this.handleGameEvent(event))
  }

  //* **********************************************
  //
  //           Player Session Handling
  //
  //* **********************************************

  addPlayer (userId, username) {
    if (!this.game.addPlayer(new RPSEngine.RPSOnlinePlayer(userId, username))) {
      throw new RPSErrors.ValidationError(
        1, `Unable to join game with ID '${this.id}' - game capacity already reached.`
      )
    }
  }

  connectPlayer (userId, connection) {
    if (this.game.player1 && this.game.player1.id === userId) {
      if (this.p1Connection != null) {
        throw new RPSErrors.ValidationError(
          RPSErrors.RPSErrorCodes.PLAYER_ALREADY_JOINED,
          'Unable to connect to game, player already connected.')
      }

      this.p1Connection = connection
      this.streamEventListener(new StateChangeEvent(this.game.id, 'creator_joined'))
    } else if (this.game.player2 != null && userId === this.game.player2.id) {
      if (!this.p1Connection) {
        throw new RPSErrors.ValidationError(
          RPSErrors.RPSErrorCodes.HOST_NOT_READY,
          'Unable to connect to game, the host has not joined yet.')
      } else if (this.p2Connection != null) {
        throw new RPSErrors.ValidationError(
          RPSErrors.RPSErrorCodes.PLAYER_ALREADY_JOINED,
          'Unable to connect to game, player already connected.')
      }

      this.p2Connection = connection
      this.streamEventListener(new StateChangeEvent(this.game.id, 'all_players_joined'))
    }

    this.broadcast({
      type: 'player_joined',
      gameData: {
        p1Id: this.game.player1.id,
        p1Name: this.game.player1.name,
        p2Id: this.game.player2 ? this.game.player2.id : null,
        p2Name: this.game.player2 ? this.game.player2.name : null
      }
    })
  }

  removePlayer (userId) {
    // Removes Player 2 from the game. A host cannot be removed
    // from their game.
    //
    // Returns a 'RemovalResult' object with information about
    // the impact of removing the player

    const removalResult = {
      playerRemoved: false,
      connectionRemoved: false
    }

    // P2 has connected but is being removed
    if (this.p2Connection && userId === this.p2Connection.userId) {
      const connectionRemovalResult = this.removeConnection(this.p2Connection)
      removalResult.playerRemoved = true
      removalResult.connectionRemoved = true
      removalResult.connection = this.p2Connection
      removalResult.connectionRemovalResult = connectionRemovalResult
    }

    // P2 has been added to the game by the matchmaker but has not connected
    if (this.game.player2 && userId === this.game.player2.id) {
      this.game.resetGame(true)
      removalResult.playerRemoved = true
    }

    return removalResult
  }

  removeConnection (connection) {
    clearInterval(this.tickTimer)
    const removalResult = {}
    if (connection === this.p1Connection) {
      removalResult.gameEnded = true
      removalResult.remainingPlayer = this.p2Connection
    } else {
      removalResult.gameEnded = false
      removalResult.remainingPlayer = this.p1Connection
      this.p2Connection = null
      this.p1Ready = false
      this.p2Ready = false
      this.game.resetGame(true)
    }
    return removalResult
  }

  isHost (userId) {
    return this.game && this.game.player1 && this.game.player1.id === userId
  }

  //* **********************************************
  //
  //           Player message handling
  //
  //* **********************************************

  handlePlayerMessage (connection, msg) {
    const handler = this.messageHandlers[msg.type]
    if (handler != null) {
      handler(connection, msg)
    }
  }

  handleSelectFighter (connection, msg) {
    if (this.getPlayerForConnection(connection).fighter) {
      logger.warn(`Select fighter message sent after a fighter was already selected. Game id: ${this.game.id}`)
      return
    }

    if (!this.selectFighter(connection, msg.characterId)) {
      connection.send(JSON.stringify({
        type: 'error',
        reason: 'Invalid character ID specified.'
      }))
      return
    }
    this.sendFighterSelectionUpdates(connection, msg.characterId)
    this.streamEventListener(new GameplayEvent(
      this.game.id,
      connection.userId,
      'select_fighter',
      msg.characterId
    ))
  }

  handleStartBattle (connection, msg) {
    if (this.game.isInProgress()) {
      logger.warning(`Start battle message sent to server while game is in progress. Game id: ${this.game.id}`)
      return
    }
    
    let activePlayer = null
    if (connection === this.p1Connection) {
      activePlayer = this.game.player1
      this.p1Ready = true
    } else if (connection === this.p2Connection) {
      activePlayer = this.game.player2
      this.p2Ready = true
    }

    if (this.p1Ready && this.p2Ready) {
      logger.debug('All players ready to battle - starting the tick!')
      this.game.startGame()
      this.tickTimer = setInterval(() => {
        this.game.tick()
      }, 1000)
    }

    this.streamEventListener(new GameplayEvent(
      this.game.id,
      activePlayer.id,
      'set_ready', ''
    ))
  }

  handleSelectWeapon (connection, msg) {
    let activePlayer = null
    if (connection === this.p1Connection) {
      activePlayer = this.game.player1
    } else if (connection === this.p2Connection) {
      activePlayer = this.game.player2
    }
    activePlayer.fighter.equipWeapon(msg.index)
  }

  //* **********************************************
  //
  //           Game State Handling
  //
  //* **********************************************

  pushState () {
    this.broadcast({
      type: 'sync',
      gameData: {
        p1Health: this.game.player1.fighter.getCurrentHealth(),
        p2Health: this.game.player2.fighter.getCurrentHealth()
      }
    })
  }

  broadcast (payload) {
    const payloadJson = JSON.stringify(payload)
    if (this.p1Connection != null) {
      this.p1Connection.send(payloadJson)
    }
    if (this.p2Connection != null) {
      this.p2Connection.send(payloadJson)
    }
  }

  selectFighter (connection, characterId) {
    const charSpec = RPSEngine.getCharacterById(characterId)
    if (!charSpec) {
      return false
    }
    this.getPlayerForConnection(connection).selectFighter(new RPSEngine.RPSFighter(charSpec))
    return true
  }

  getPlayerForConnection (connection) {
    if (connection === this.p1Connection) {
      return this.game.player1
    } else if (connection === this.p2Connection) {
      return this.game.player2
    }
    return null
  }

  sendFighterSelectionUpdates (connection, selectedCharacterId) {
    let selectedPlayer = null
    let opponentPlayer = null
    let opponentHasMadeSelection = false
    let opponentConnection = null

    if (connection === this.p1Connection) {
      selectedPlayer = this.game.player1
      opponentPlayer = this.game.player2
      opponentConnection = this.p2Connection
      opponentHasMadeSelection = this.game.player2 == null ? false : this.game.player2.ready()
    } else if (connection === this.p2Connection) {
      selectedPlayer = this.game.player2
      opponentPlayer = this.game.player1
      opponentConnection = this.p1Connection
      opponentHasMadeSelection = this.game.player1 == null ? false : this.game.player1.ready()
    }

    const selectionNotification = JSON.stringify({
      type: 'select_fighter',
      gameData: {
        playerId: selectedPlayer.id,
        selectedCharacterId: selectedCharacterId
      }
    })

    connection.send(selectionNotification)
    if (opponentHasMadeSelection) {
      // We don't want to notify another player of their opponents selection
      // Until they've made their selection - just in case they're sniffing
      opponentConnection.send(selectionNotification)
      connection.send(JSON.stringify({
        type: 'select_fighter',
        gameData: {
          playerId: opponentPlayer.id,
          selectedCharacterId: opponentPlayer.fighter.id
        }
      }))
    }
  }

  handleGameEvent (event) {
    this.broadcast({
      type: event.classtype,
      eventData: event
    })

    if (event instanceof RPSEngine.RPSRoundEvent) {
      switch (event.type) {
        case RPSEngine.RPSRoundEvent.STATE_CHANGE:
          this.pushState()
          break
        case RPSEngine.RPSRoundEvent.ROUND_STARTED:
          this.streamEventListener(new GameProgressEvent(
            this.game.id, 'round_started', this.game.player1.id, this.game.player2.id, {})
          )
          break
        case RPSEngine.RPSRoundEvent.ROUND_FINISHED:
          this.streamEventListener(new GameProgressEvent(
            this.game.id, 'round_finished', this.game.player1.id, this.game.player2.id, {
              round_winner_id: event.data.roundWinnerId,
              round_loser_id: event.data.roundLoserId
            })
          )
          break
        case RPSEngine.RPSRoundEvent.WEAPONS_SELECTED:
          this.streamEventListener(new GameplayEvent(
            this.game.id,
            this.game.player1.id,
            'select_weapon',
            '' + this.game.player1.fighter.currentSelectedWeaponIndex
          ))
          this.streamEventListener(new GameplayEvent(
            this.game.id,
            this.game.player2.id,
            'select_weapon',
            '' + this.game.player2.fighter.currentSelectedWeaponIndex
          ))
          break
      }
    } else if (
      event instanceof RPSEngine.RPSGameEvent &&
      event.type === RPSEngine.RPSGameEvent.GAME_COMPLETE
    ) {
      clearInterval(this.tickTimer)
      this.streamEventListener(new GameOverEvent(
        this.game.id,
        event.data.winnerId,
        event.data.loserId
      ))
      this.gameOverListener()
    }
  }
}

exports.MultiPlayerGame = MultiPlayerGame
