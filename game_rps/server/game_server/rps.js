/**
 *
 *  Game Logic for Rock Paper Scissors.
 *
 *  Manages all client interactions via given websocket.
 *
 *  The RPSServer class is not responsible for any game logic, it
 *  is the communication layer of the game and performs
 *  basic input validation and error handling.
 *
**/
const crypto = require('crypto')
const RPSErrors = require('./rps_errors.js')
const GameHandler = require('./game_handler.js')
const logger = require('./logger')
const { StreamEvent } = require('./event_stream')

class RPSServer {
  constructor (metricsClient) {
    this.activeGames = {} // Maps a game ID to a GameHandler.MultiPlayerGame object
    this.tokenGameMap = {} // Maps game tokens to game IDs
    this.metricsClient = metricsClient
  }

  start (websocketServer, eventStream) {
    this.initMetrics()
    websocketServer.on(
      'connection', (ws, req) => this.initialiseSocketConnection(ws, req)
    )
    this.eventStream = eventStream
  }

  initMetrics () {
    this.activeGamesGauge = null
    this.wsMessagesReceivedCounter = null

    if (this.metricsClient) {
      this.activeGamesGauge = new this.metricsClient.Gauge({
        name: 'game_rps_active_games_total',
        help: 'Current number of active games.'
      })
      this.activeGamesGauge.reset()

      this.activeConnectionsGauge = new this.metricsClient.Gauge({
        name: 'game_rps_active_connections_total',
        help: 'Current number of active socket connections.'
      })
      this.activeConnectionsGauge.reset()

      this.wsMessagesReceivedCounter = new this.metricsClient.Counter({
        name: 'game_rps_socket_messages_received',
        help: 'The number of socket messages received.'
      })
    }
  }

  emitActiveGameCountMetric () {
    if (this.activeGamesGauge) this.activeGamesGauge.set(Object.keys(this.activeGames).length)
  }

  //* **********************************************
  //
  //           Connection Management
  //
  //* **********************************************

  initialiseSocketConnection (ws, req) {
    // TODO: Validate Game ID and User here. Player should have already
    // joined and be attached to the game.
    const connectionURL = new URL(req.url, `http://${req.headers.host}`)
    const gameToken = connectionURL.searchParams.get('game_token')
    const userId = connectionURL.searchParams.get('user_id')

    logger.info(`Socket connection opened - validating game data. User id: ${userId}, token: ${gameToken}`)

    if (!gameToken || !userId) {
      logger.warn('RPSServer: Invalid connect request, user Id and game token must not be null')
      ws.close(1000, 'A user ID and game token must be supplied.')
      return
    }

    const gameId = this.getGameIdForToken(gameToken)

    if (!gameId) {
      logger.warn(`Could not find a game for supplied token: ${gameToken}`)
      ws.close(1000, 'Supplied token has no active games associated with it.')
      return
    }

    const gameToConnectTo = this.activeGames[gameId]

    if (!gameToConnectTo) {
      logger.warn(`No active game found for game id: ${gameId}`)
      ws.close(1000, 'No active game data found for supplied game ID.')
      return
    }

    this.initConnection(userId, gameToken, gameId, gameToConnectTo, ws)
  }

  initConnection (userId, gameToken, gameId, gameToConnectTo, ws) {
    logger.info(`Initializing user connection to game. User id: ${userId}, game id: ${gameId}, token: ${gameToken}`)

    // We need to be able to reference the game token,
    // ID and user ID when a websocket receives a message
    ws.gameToken = gameToken
    ws.userId = userId
    ws.gameId = gameId

    try {
      this.registerSocketConnection(ws, userId, gameToConnectTo)
      if (this.activeConnectionsGauge) this.activeConnectionsGauge.inc()
      logger.info(`Successfully connected user to game. User id: ${userId}, game id: ${gameId}, token: ${gameToken}`)
    } catch (err) {
      if (err instanceof RPSErrors.ValidationError) {
        logger.warn(
          `A validation error occurred while registering a socket connection  to the game. 
          Error message: ${err.message}`
        )
        ws.close(err.errorCode, 'A validation error occurred connection to the game.')
      } else {
        logger.error(
          `An unexpected error happened while registering a socket connection to the game server. 
          Error: ${err}`
        )
        ws.close(1000, 'Unknown error.')
      }
    }
  }

  registerSocketConnection (ws, userId, gameToConnectTo) {
    gameToConnectTo.connectPlayer(userId, ws)
    ws.on('message', message => {
      if (this.wsMessagesReceivedCounter) this.wsMessagesReceivedCounter.inc()
      this.handleMessage(ws, message)
    })

    ws.on('open', () => {
      this.handleConnectionOpen(ws)
    })

    ws.on('error', error => {
      this.handleError(ws, error)
    })

    ws.on('close', () => {
      if (this.activeConnectionsGauge) this.activeConnectionsGauge.dec()
      this.handleConnectionClose(ws)
    })
  }

  // ****************************************************
  //
  //              Socket Message Handling
  //
  // ****************************************************

  handleConnectionOpen (ws) {
    logger.info(`Socket connection opened for user id ${ws.userId} to game id ${ws.gameId}`)
  }

  handleMessage (ws, message) {
    logger.debug(`Received a message from user id ${ws.userId}. Data: ${message}`)
    try {
      const parsedMessage = JSON.parse(message)
      const game = this.activeGames[ws.gameId]
      if (game == null) {
        logger.warn(
          `Error handling player message: Game not found.
          User id ${ws.userId}, game id: ${ws.gameId}`
        )
        ws.close(400, 'Game not found.')
        return
      }
      game.handlePlayerMessage(ws, parsedMessage)
    } catch (err) {
      logger.error(`Unexpected error handling player message. Error message: ${err.message}`)
      ws.send(JSON.stringify({ type: 'error', message: err.message, code: -1 }))
    }
  }

  handleError (ws, error) {
    logger.error(`Socket error. Error: ${error}. User id: ${ws.userId}, game id: ${ws.gameId}`)
  }

  handleConnectionClose (ws) {
    // In this case a player closed their connection to the game.
    logger.info(`Socket connection closed. User id: ${ws.userId}, game id: ${ws.gameId}`)
    const game = this.activeGames[ws.gameId]
    if (!game) {
      return // No game to clean up
    }

    const connectionRemovalResult = game.removeConnection(ws)

    if (connectionRemovalResult.gameEnded) {
      this.handleHostRemoval(ws, connectionRemovalResult)
    } else {
      this.handlePlayerRemoval(ws, connectionRemovalResult)
    }
  }

  //* **********************************************
  //
  //              Game Management
  //
  //* **********************************************

  pushStreamEvent (event) {
    try {
      this.eventStream.sendStreamEvent(event)
    } catch (err) {
      logger.error(`Error sending event to event stream, error ${err}`)
    }
  }

  createGameDataResponse (game) {
    return {
      gameToken: game.token
    }
  }

  handleHostRemoval (ws, removalResult) {
    logger.info(`Host connection closed, removing game. User id: ${ws.userId}, game id: ${ws.gameId}`)
    this.removeGame(ws.gameId, 'Host disconnected.')
    if (removalResult.remainingPlayer) { // If P2 is still there we need to disconnect them
      removalResult.remainingPlayer.send(JSON.stringify({
        type: 'error',
        message: 'Host disconnected',
        code: RPSErrors.RPSErrorCodes.HOST_DISCONNECTED
      }))
      removalResult.remainingPlayer.close(1000, 'Game host disconnected')
    }
  }

  handlePlayerRemoval (ws, removalResult) {
    logger.info(`Non-host connection closed, notifying host. User id: ${ws.userId}, game id: ${ws.gameId}`)
    this.pushStreamEvent(new StreamEvent(ws.gameId, 'player_disconnect', { player_id: ws.userId }))
    removalResult.remainingPlayer.send(JSON.stringify({
      type: 'error',
      message: 'Opponent disconnected',
      code: RPSErrors.RPSErrorCodes.PLAYER_DISCONNECTED
    }))
  }

  // ****************************************************
  //
  //              Game creation / mgmt
  //
  // ****************************************************

  getActiveGameIds () {
    if (this.activeGames == null) {
      return []
    }
    return Object.keys(this.activeGames)
  }

  getGameIdForToken (gameToken) {
    return this.tokenGameMap[gameToken]
  }

  createGame (gameId, userId, username) {
    if (!gameId) {
      throw new RPSErrors.ValidationError(
        1, 'Unable to create game - no game ID specified.'
      )
    }

    if (!userId) {
      throw new RPSErrors.ValidationError(
        1, 'Unable to create game - no user ID specified.'
      )
    }

    if (!username) {
      throw new RPSErrors.ValidationError(
        1, 'Unable to create game - no user name specified.'
      )
    }

    if (this.activeGames[gameId] != null) {
      throw new RPSErrors.ValidationError(
        1, `Unable to create game. A game with id: '${gameId}' already exists.`
      )
    }

    logger.info(`Creating a new game. User id: ${userId}, game id: ${gameId}`)

    const gameToken = crypto.randomBytes(16).toString('hex')
    const gameWrapper = new GameHandler.MultiPlayerGame(
      gameToken, gameId, userId, username,
      (gameId, event) => this.pushStreamEvent(gameId, event),
      () => this.removeGame(gameId)
    )
    this.activeGames[gameId] = gameWrapper
    this.tokenGameMap[gameToken] = gameId
    this.emitActiveGameCountMetric()
    return this.createGameDataResponse(gameWrapper)
  }

  joinGame (gameId, userId, username) {
    if (!gameId) {
      throw new RPSErrors.ValidationError(
        1, 'Unable to join a game - no game ID specified.'
      )
    }

    const gameWrapper = this.activeGames[gameId]

    if (!gameWrapper) {
      throw new RPSErrors.ValidationError(
        1, `Unable to join game with ID '${gameId}' - it does not exist.`
      )
    }
    gameWrapper.addPlayer(userId, username)
    return this.createGameDataResponse(gameWrapper)
  }

  removePlayer (gameId, userId) {
    if (!gameId) {
      throw new RPSErrors.ValidationError(
        1, 'Unable to join a game - no game ID specified.'
      )
    }

    const gameWrapper = this.activeGames[gameId]

    if (!gameWrapper) {
      throw new RPSErrors.ValidationError(
        1, `Unable to remove player from game with ID '${gameId}' - it does not exist.`
      )
    }

    if (gameWrapper.isHost(userId)) {
      throw new RPSErrors.ValidationError(
        1, 'Unable remove player - The host of a game cannot be removed.'
      )
    }

    const removalResult = gameWrapper.removePlayer(userId)
    if (removalResult.connectionRemoved) {
      this.handlePlayerRemoval(removalResult.connection, removalResult.connectionRemovalResult)
    }

    return removalResult
  }

  removeGame (gameId, msg = 'This game has been removed.') {
    if (!gameId) {
      throw new RPSErrors.ValidationError(1, 'Unable to remove game - no game ID specified.')
    }

    const game = this.activeGames[gameId]

    if (!game) {
      logger.info(`Unable to remove game: Game not found. Game id: ${gameId}, msg: ${msg}`)
      return null
    }

    if (game.p1Connection) {
      game.p1Connection.close(1000, msg)
    }
    if (game.p2Connection) {
      game.p2Connection.close(1000, msg)
    }

    this.pushStreamEvent(new StreamEvent(gameId, 'game_removed'))

    delete this.tokenGameMap[game.gameToken]
    delete this.activeGames[gameId]
    this.emitActiveGameCountMetric()

    logger.info(`Game removed, game id: ${gameId}, msg: ${msg}`)
    return this.createGameDataResponse(game)
  }
}

exports.RPSServer = RPSServer
