import { gameConfig } from './game_data/config.js'

import {
  RPSGame, RPSPlayer, RPSStrategyBot, RPSGameMode,
  RPSFighter, RPSRoundEvent, RPSRandomBot,
  RPSGameEvent, getCharacterById, getBossCharacterId
} from 'rps-game-engine'

class GameViewData {
  constructor (gameMode) {
    // Player data
    this.activePlayerId = null // The ID of the player running *this* client
    this.p1Id = null
    this.p2Id = null
    this.p1DisplayName = ''
    this.p2DisplayName = ''
    this.p1Spec = null
    this.p2Spec = null

    // Round related data
    this.currentRound = 1
    this.p1CurrentHealth = 0
    this.p2CurrentHealth = 0

    // Game related data
    this.winnerId = null
    this.gameMode = gameMode

    this.interfaceErrors = []
  }

  softReset () {
    this.p2Id = null
    this.p2DisplayName = ''
    this.p2Spec = null
    this.currentRound = 1
    this.p1CurrentHealth = 0
    this.p2CurrentHealth = 0
    this.winnerId = null
    this.interfaceErrors = []
  }
}

class GameEngineInterface {
  constructor (gameViewData) {
    this.gameViewData = gameViewData
  }

  getGameViewData () {
    return this.gameViewData
  }

  selectFighter (characterSpec, callback) {
  }

  startGame () {

  }

  endGame () {

  }

  addEventListener () {
    console.warning('Event listener added to abstract GameEngineInterface base class. Events will be ignored.')
  }
}

class SinglePlayerGame extends GameEngineInterface {
  constructor (gameSettings, gameState) {
    super(new GameViewData(RPSGameMode.SINGLE))
    this.game = new RPSGame(3, RPSGameMode.SINGLE)
    this.gameSettings = gameSettings
    this.gameState = gameState
    this.paused = false
    // The Sequence Number is the number of back to back single player victories
    // before this game. It allows us to decide which NPC they will face next
    // in their campaign
    this.game.addPlayer(new RPSPlayer('player'))
    this.game.addPlayer(this.createComputerPlayer())

    this.game.addEventListener((event) => this.handleNPCEvent(event))
    this.game.addEventListener((event) => {
      if (event instanceof RPSGameEvent && event.type === RPSGameEvent.GAME_COMPLETE) {
        this.gameViewData.winnerId = this.game.p1Wins > this.game.p2Wins ? this.game.player1.id : this.game.player2.id
        this.endGame()
      } else if (event instanceof RPSRoundEvent) {
        this.gameViewData.p1CurrentHealth = this.game.player1.fighter.getCurrentHealth()
        this.gameViewData.p2CurrentHealth = this.game.player2.fighter.getCurrentHealth()
        if (event.type === RPSRoundEvent.ROUND_FINISHED) {
          if (event.data.roundWinnerId !== this.gameViewData.p1Id) {
            this.gameState.undefeated = false
          }
          this.gameViewData.currentRound += 1
        }
      }
    })

    this.gameViewData.activePlayerId = this.game.player1.id
    this.gameViewData.p1Id = this.game.player1.id
    this.gameViewData.p2Id = this.game.player2.id
  }

  endGame () {
    console.log('Game ended - clearing tick interval.')
    clearInterval(this.tickTimer)
  }

  createComputerPlayer () {
    if (this.gameState.isBossFight) { // Random is the most difficult to play against
      return new RPSRandomBot('computer')
    }
    return new RPSStrategyBot('computer', Math.min(this.gameState.sequence, 3))
  }

  selectFighter (characterSpec, callback) {
    this.game.player1.selectFighter(new RPSFighter(characterSpec))
    this.gameViewData.p1Spec = characterSpec
    this.gameViewData.p1CurrentHealth = characterSpec.stats.health
    this.gameViewData.p1DisplayName = characterSpec.displayName

    // Wait a second and then select the P2 Fighter from the
    // single player opponent sequence in the character spec
    setTimeout(() => {
      let nextOpponentId = null
      if (this.gameState.isBossFight) {
        nextOpponentId = getBossCharacterId()
      } else {
        const opponentIndex = this.gameState.sequence
        if (opponentIndex >= characterSpec.singlePlayerSequence.length) {
          throw new Error('Invalid game setup - opponent index greater than list of available opponents.')
        }
        nextOpponentId = characterSpec.singlePlayerSequence[opponentIndex]
      }
      const fighter = new RPSFighter(getCharacterById(nextOpponentId))
      this.game.player2.selectFighter(fighter)
      this.gameViewData.p2Spec = fighter.spec
      this.gameViewData.p2DisplayName = fighter.spec.displayName
      this.gameViewData.p2CurrentHealth = fighter.spec.stats.health
    }, this.gameSettings.vsScreenDelay)

    callback()
  }

  selectWeapon (weaponIndex) {
    this.game.player1.fighter.equipWeapon(weaponIndex)
  }

  handleNPCEvent (event) {
    this.game.player2.eventListener(event)
  }

  startGame () {
    this.game.startGame()
    console.log('Single player game - starting client side tick loop...')
    this.tickTimer = setInterval(() => {
      if (!this.paused) {
        this.game.tick()
      }
    }, 500)
  }

  togglePause () {
    this.paused = !this.paused
  }

  pauseGame () {
    this.paused = true
  }

  resumeGame () {
    this.paused = false
  }

  addEventListener (listener) {
    if (listener != null) {
      this.game.addEventListener(listener)
    }
  }
}

class ServerErrorCodes {
  static get HOST_NOT_READY () { return 4000 }
  static get PLAYER_ALREADY_JOINED () { return 4001 }
  static get HOST_DISCONNECTED () { return 4002 }
  static get PLAYER_DISCONNECTED () { return 4003 }
}

class MultiPlayerGame extends GameEngineInterface {
  constructor (gameServerUrl, token, userId) {
    super(new GameViewData(RPSGameMode.MULTI))

    this.gameServerUrl = gameServerUrl
    this.userId = userId
    this.token = token
    this.gameEventListeners = [] // Events will be sent from the server to these listeners

    this.addEventListener((event) => {
      if (event instanceof RPSGameEvent && event.type === RPSGameEvent.GAME_COMPLETE) {
        this.gameViewData.winnerId = event.data.winnerId
      } else if (event instanceof RPSRoundEvent && event.type === RPSRoundEvent.ROUND_FINISHED) {
        this.gameViewData.currentRound += 1
      }
    })

    this.gameViewData.activePlayerId = userId
    this.gameServerSocketConnection = null
  }

  selectFighter (characterSpec, callback) {
    this.selectFighterCallback = callback
    this.gameServerSocketConnection.send(JSON.stringify({
      type: 'select_fighter',
      characterId: characterSpec.id
    }))
  }

  selectWeapon (weaponIndex) {
    this.gameServerSocketConnection.send(JSON.stringify({
      type: 'select_weapon',
      index: weaponIndex
    }))
  }

  startGame () {
    this.gameServerSocketConnection.send(JSON.stringify({
      type: 'start_battle'
    }))
  }

  addEventListener (listener) {
    if (listener != null) {
      this.gameEventListeners.push(listener)
    }
  }

  notifyEventListeners (event) {
    for (let i = 0; i < this.gameEventListeners.length; i++) {
      this.gameEventListeners[i](event)
    }
  }

  connectToGameServer (connectionSuccessCallback, connectionErrorCallback) {
    const url = `${gameConfig.socketProtocol}://${this.gameServerUrl}?game_token=${this.token}&user_id=${this.userId}`

    console.log('MultiPlayerInterface: Connecting to game server => ' + url)
    try {
      this.gameServerSocketConnection = new WebSocket(url)
    } catch (error) {
      console.error(error)
      if (connectionErrorCallback) {
        connectionErrorCallback()
      }
      return
    }
    console.log('Connection with game server established.')
    if (connectionSuccessCallback) {
      connectionSuccessCallback()
    }

    this.gameServerSocketConnection.onopen = () => {
      console.log('MultiPlayerInterface: Socket connection opened with the server')
    }

    this.gameServerSocketConnection.onerror = (event) => {
      console.log('MultiPlayerInterface: WebSocket error!')
    }

    this.gameServerSocketConnection.onclose = (event) => {
      console.log(`MultiPlayerInterface: WebSocket closed by the server. Code: ${event.code} Reason: ${event.reason}`)
      this.gameViewData.interfaceErrors.push({
        message: 'The game host disconnected.',
        action: 'reset-hard'
      })
      if (connectionErrorCallback) {
        connectionErrorCallback()
      }
    }

    this.gameServerSocketConnection.onmessage = (e) => {
      console.log('MultiPlayerInterface: Received a message from the game server => ' + e.data)
      const message = JSON.parse(e.data)

      if (message.type === 'player_joined') {
        this.gameViewData.p1Id = message.gameData.p1Id
        this.gameViewData.p1DisplayName = message.gameData.p1Name
        this.gameViewData.p2Id = message.gameData.p2Id
        this.gameViewData.p2DisplayName = message.gameData.p2Name
      } else if (message.type === 'sync') {
        this.gameViewData.p1CurrentHealth = message.gameData.p1Health
        this.gameViewData.p2CurrentHealth = message.gameData.p2Health
      } else if (message.type === 'select_fighter') {
        if (message.gameData.playerId === this.gameViewData.p1Id) {
          console.log('P1 selected char: ' + message.gameData.selectedCharacterId)
          this.gameViewData.p1Spec = getCharacterById(message.gameData.selectedCharacterId)
        } else if (message.gameData.playerId === this.gameViewData.p2Id) {
          this.gameViewData.p2Spec = getCharacterById(message.gameData.selectedCharacterId)
        }

        if (this.selectFighterCallback != null) {
          this.selectFighterCallback()
          this.selectFighterCallback = null
        }
      } else if (message.type === 'RPSRoundEvent') {
        this.notifyEventListeners(new RPSRoundEvent(
          message.eventData.type,
          message.eventData.data
        ))
      } else if (message.type === 'RPSGameEvent') {
        this.notifyEventListeners(new RPSGameEvent(
          message.eventData.type,
          message.eventData.data
        ))
      } else if (message.type === 'error') {
        this.handleGameServerError(message)
      }
    }
  }

  softResetGameState () {
    this.gameViewData.softReset()
  }

  handleGameServerError (message) {
    if (message.code === ServerErrorCodes.PLAYER_DISCONNECTED) {
      this.gameViewData.interfaceErrors.push({
        message: 'Your opponent has disconnected.',
        action: 'reset-soft'
      })
    }
  }
}

export { SinglePlayerGame, MultiPlayerGame }
