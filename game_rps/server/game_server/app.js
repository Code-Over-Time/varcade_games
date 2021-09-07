/**
 *
 *  Entry point for the Rock Paper Scissors game server.
 *
 *  This file is responsible for initializing the various systems
 *  that the game server depends on:
 *
 *      - HTTP server for the matchmaker to connect to
 *      - Websocket server for players to connect to
 *      - Eventstream for sending updates to the matchmaker
 *      - Logging
 *      - Metrics
 *
 *  See package.json for scripts to run in dev/prod mod.
 *
**/

// External Dependencies
const express = require('express') // Our HTTP Server
const cors = require('cors')
const promBundle = require('express-prom-bundle')

// Internal Dependencies
const logger = require('./logger')
const httpLogger = require('./httpLogger')
const RPS = require('./rps.js')
const RPSErrors = require('./rps_errors.js')

// ****************************************************
//
//              Initialization
//
// ****************************************************

// Metrics
const metricsMiddleware = promBundle({
  includePath: true,
  httpDurationMetricName: 'game_rps_server_http_request_duration'
}) // Prometheus middleware

// HTTP Server
const app = express()
app.use(metricsMiddleware)
app.use(cors())
app.use(express.json())
app.use(httpLogger)

// Rock Paper Scissors Game Server
const rpsGameServer = new RPS.RPSServer(promBundle.promClient)

// ****************************************************
//
//              Routing
//
// ****************************************************

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  logger.info('*** Starting RPS game server in development mode ***')

  // This will allow a test client to fetch active games directly
  // In production the matchmaker will be responsible for managing games and connecting players,
  // in development we want to be able to test the game client and server in isolation
  app.get('/active_games', function (req, res) {
    res.json(rpsGameServer.getActiveGameIds())
  })
}

app.post('/create_game', function (req, res) {
  logger.info(`Received create game request: ${JSON.stringify(req.body)}`)
  if (!validateGameRequest(req, res)) {
    return
  }
  try {
    const gameData = rpsGameServer.createGame(
      req.body.gameId,
      req.body.userId,
      req.body.username)
    res.json(gameData)
  } catch (err) {
    if (err instanceof RPSErrors.ValidationError) {
      logger.warn(`Unable to create a new game, error message: ${err.message}`)
      sendErrorResponse(res, 400, err.message)
    } else {
      logger.error(`Unable to create a new game, error message: ${err.message}`)
      sendErrorResponse(res, 500, 'An unexpected error occurred while trying to join the game.')
    }
  }
})

app.post('/join_game', function (req, res) {
  logger.info(`Received join game request: ${JSON.stringify(req.body)}`)
  // Validation function handles error response creation
  if (!validateGameRequest(req, res)) {
    return
  }

  try {
    const gameData = rpsGameServer.joinGame(
      req.body.gameId,
      req.body.userId,
      req.body.username
    )
    res.json(gameData)
  } catch (err) {
    if (err instanceof RPSErrors.ValidationError) {
      logger.warn(`Unable to join a game, error message: ${err.message}`)
      sendErrorResponse(res, 400, err.message)
    } else {
      logger.error(`Unable to join game, error message: ${err.message}`)
      sendErrorResponse(res, 500, 'An unexpected error occurred while trying to join the game.')
    }
  }
})

app.post('/remove_game', function (req, res) {
  try {
    logger.info(`Received remove game request: ${JSON.stringify(req.body)}`)
    const gameData = rpsGameServer.removeGame(req.body.gameId)
    res.send(JSON.stringify(gameData))
  } catch (err) {
    logger.error(`Unable to remove game, error message: ${err.message}`)
    sendErrorResponse(res, 500, 'An unexpected error occurred while trying to remove the game.')
  }
})

app.post('/remove_player', function (req, res) {
  try {
    logger.info(`Received remove player request: ${JSON.stringify(req.body)}`)
    const result = rpsGameServer.removePlayer(req.body.gameId, req.body.userId)

    if (!result.playerRemoved) {
      sendErrorResponse(res, 404, `Player ${req.body.userId} not not found in game ${req.body.gameId}.`)
      return
    } else {
      res.send(result)
    }
  } catch (err) {
    logger.error(`Unable to remove game, error message: ${err.message}`)
    if (err instanceof RPSErrors.ValidationError) {
      sendErrorResponse(res, 400, err.message)
    } else {
      sendErrorResponse(res, 500, 'An unexpected error occurred while trying to remove the game.')
    }
  }
})

function validateGameRequest (req, res) {
  /**
     * Validates that create/join requests contain a non-empty string
     * for required parameters. This function will send an error message
     * if validation fails.
     *
     * @param  {Request} req    Express request object
     * @param  {Response} res   Express response object
     * @return {Boolean}        True if parameters are valid, False otherwise.
  */
  const gameId = req.body.gameId
  const userId = req.body.userId
  const username = req.body.username

  if (typeof (gameId) !== 'string' || !gameId.length) {
    logger.warn(`Received an invalid gameId in create or join request, game id: '${gameId}'`)
    sendErrorResponse(res, 400, 'Invalid gameId format.')
    return false
  }
  if (typeof (userId) !== 'string' || !userId.length) {
    logger.warn(`Received an invalid userId in create or join request, user id: '${userId}'`)
    sendErrorResponse(res, 400, 'Invalid userId format.')
    return false
  }
  if (typeof (username) !== 'string' || !username.length) {
    logger.warn(`Received an invalid username in create or join request: '${username}'`)
    sendErrorResponse(res, 400, 'Invalid username format.')
    return false
  }
  return true
}

function sendErrorResponse (response, httpCode, errorMessage) {
  response.status(httpCode).json({
    message: errorMessage
  })
}

module.exports = {
  appServer: app,
  gameServer: rpsGameServer
}
