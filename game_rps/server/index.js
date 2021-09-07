const WebSocket = require('ws')
const logger = require('./game_server/logger')
const RPSApp = require('./game_server/app')
const eventStream = require('./game_server/event_stream.js')

// Server Config
const httpServerPort = 8080
const httpServerHost = '0.0.0.0'
const socketPort = 8085
const socketHost = '0.0.0.0'
const eventStreamURL = 'redis://redis-db:6379/1'

logger.info(`Initializing RPS game server, Node version: ${process.version}`)

// Socket Server
logger.info(`Starting websocket server, listening on  ${socketHost}:${socketPort}`)
const wss = new WebSocket.Server({ host: socketHost, port: socketPort })

// Event Stream
logger.info(`Connecting to event stream at URL => ${eventStreamURL}`)
const matchmakerEventStream = new eventStream.EventStream(eventStreamURL, 'exrps')

// HTTP server
RPSApp.appServer.listen(httpServerPort, httpServerHost, function () {
  logger.info(`Starting app server, listening at http://${httpServerHost}:${httpServerPort}`)
})

logger.info('Starting RPS game server instance')
RPSApp.gameServer.start(wss, matchmakerEventStream)
