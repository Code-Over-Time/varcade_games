// Internal Imports
const RPSServer = require('../game_server/rps')
const RPSErrors = require('../game_server/rps_errors')
const MockSock = require('./mock_sock.js')
const RPSEngine = require('rps-game-engine')

// External Imports
const should = require('chai').should()

describe('RPS Game Server Web Socket Interface', () => { // eslint-disable-line
  /**
  *     Test the initialisation of a new websocket connection.
  *
  *     This is the point where users first connect to the game server
  *     via a socket url with a game token.
  **/
  describe('initialise game server socket connection', () => { // eslint-disable-line
    const rpsServer = new RPSServer.RPSServer(null)
    const websocketServer = new MockSock.MockWebSocketServer()
    const ws = new MockSock.MockWebSocket()
    rpsServer.start(websocketServer)

    it('should close socket connection due to missing game token', () => { // eslint-disable-line
      // This is mimicing a websocket connect
      // Our test starts in the callback for this event
      websocketServer.connect(ws, {
        url: 'ws://www.rps.com?game_token=abc',
        headers: {
          host: 'ws://www.rps.com'
        }
      })

      should.exist(websocketServer.lastAction)
      websocketServer.lastAction.should.eql('connection')

      ws.methodCalls.length.should.eql(1)
      ws.methodCalls[0].method.should.eql('close')
      ws.methodCalls[0].args.errorCode.should.eql(1000)
      ws.methodCalls[0].args.message.should.eql('A user ID and game token must be supplied.')
    })

    it('should close socket connection due to missing userId', () => { // eslint-disable-line
      ws.reset()
      websocketServer.connect(ws, {
        url: 'http://www.rps.com?user_id=123',
        headers: {
          host: 'http://www.rps.com'
        }
      })

      should.exist(websocketServer.lastAction)
      websocketServer.lastAction.should.eql('connection')

      ws.methodCalls.length.should.eql(1)
      ws.methodCalls[0].method.should.eql('close')
      ws.methodCalls[0].args.errorCode.should.eql(1000)
      ws.methodCalls[0].args.message.should.eql('A user ID and game token must be supplied.')
    })

    it('should close socket connection due to no active game', () => { // eslint-disable-line
      ws.reset()
      websocketServer.connect(ws, {
        url: 'http://www.rps.com?game_token=abc&user_id=123',
        headers: {
          host: 'http://www.rps.com'
        }
      })

      should.exist(websocketServer.lastAction)
      websocketServer.lastAction.should.eql('connection')

      ws.methodCalls.length.should.eql(1)
      ws.methodCalls[0].method.should.eql('close')
      ws.methodCalls[0].args.errorCode.should.eql(1000)
      ws.methodCalls[0].args.message.should.eql('Supplied token has no active games associated with it.')
    })

    it('should fail to connect to a game due to missing game data (unexpected error)', () => { // eslint-disable-line
      ws.reset()
      const testUserId = 'testUser'
      const testGameId = 'tgid'

      const createGameReponse = rpsServer.createGame(testGameId, testUserId, 'uname')
      // We need to force this error scenario
      delete rpsServer.activeGames[testGameId]

      websocketServer.connect(ws, {
        url: `http://www.rps.com?game_token=${createGameReponse.gameToken}&user_id=${testUserId}`,
        headers: {
          host: 'http://www.rps.com'
        }
      })

      should.exist(websocketServer.lastAction)
      websocketServer.lastAction.should.eql('connection')

      ws.methodCalls.length.should.eql(1)
      ws.methodCalls[0].method.should.eql('close')
      ws.methodCalls[0].args.errorCode.should.eql(1000)
      ws.methodCalls[0].args.message.should.eql('No active game data found for supplied game ID.')
    })

    it('should successfully connect to a game', () => { // eslint-disable-line
      const testUserId = 'testUser'
      const testGameId = 'testGameId'
      const testUsername = 'testUsername'
      const createGameReponse = rpsServer.createGame(testGameId, testUserId, testUsername)

      ws.reset()
      // This is mimicing a websocket connect
      // Our test starts in the callback for this event
      websocketServer.connect(ws, {
        url: `http://www.rps.com?game_token=${createGameReponse.gameToken}&user_id=${testUserId}`,
        headers: {
          host: 'http://www.rps.com'
        }
      })

      should.exist(websocketServer.lastAction)
      websocketServer.lastAction.should.eql('connection')

      // on() is called 4 times to register callbacks, then send is called to send game data
      ws.methodCalls.length.should.eql(5)
      // The last socket call should be
      ws.methodCalls[0].method.should.eql('send')

      // Verify the initial game sync
      const responseData = JSON.parse(ws.methodCalls[0].args.message)
      responseData.type.should.eql('player_joined')
      responseData.gameData.p1Id.should.eql(testUserId)
      responseData.gameData.p1Name.should.eql(testUsername)
    })

    it('should fail to connect to valid game due to validation error', () => { // eslint-disable-line
      const testUserId = 'testUser'
      const testGameId = 'reconnectErrorTest'
      const testUsername = 'testUsername2'
      const createGameReponse = rpsServer.createGame(testGameId, testUserId, testUsername)

      ws.reset()

      const req = {
        url: `http://www.rps.com?game_token=${createGameReponse.gameToken}&user_id=${testUserId}`,
        headers: {
          host: 'http://www.rps.com'
        }
      }

      // Firs connection should be successful
      websocketServer.connect(ws, req)

      should.exist(websocketServer.lastAction)
      websocketServer.lastAction.should.eql('connection')

      // on() is called 4 times to register callbacks, then send is called to send game data
      ws.methodCalls.length.should.eql(5)
      // The last socket call should be
      ws.methodCalls[0].method.should.eql('send')

      // Reconnecting should trigger a validation error and add an additional send on the WS
      websocketServer.connect(ws, req)
      ws.methodCalls.length.should.eql(6)
      ws.methodCalls[5].method.should.eql('close')
      ws.methodCalls[5].args.message.should.eql('A validation error occurred connection to the game.')
      ws.methodCalls[5].args.errorCode.should.eql(RPSErrors.RPSErrorCodes.PLAYER_ALREADY_JOINED)
    })

    it('should fail to connect to game due to some unexpected error', () => { // eslint-disable-line
      const testUserId = 'testUser'
      const testGameId = 'unexpectedConnectErrorTest'
      const testUsername = 'testUsername'
      const createGameReponse = rpsServer.createGame(testGameId, testUserId, testUsername)

      ws.reset()

      const req = {
        url: `http://www.rps.com?game_token=${createGameReponse.gameToken}&user_id=${testUserId}`,
        headers: {
          host: 'http://www.rps.com'
        }
      }

      // Monkey patch the active game method so we can force some unexpected error
      const activeGame = rpsServer.activeGames[testGameId]
      activeGame.connectPlayer = function (userId, connection) {
        throw Error('Some unknown exception')
      }

      websocketServer.connect(ws, req)
      should.exist(websocketServer.lastAction)
      websocketServer.lastAction.should.eql('connection')

      // Reconnecting should trigger a validation error and add an additional send on the WS
      ws.methodCalls.length.should.eql(1)
      ws.methodCalls[0].method.should.eql('close')
      ws.methodCalls[0].args.message.should.eql('Unknown error.')
      ws.methodCalls[0].args.errorCode.should.eql(1000)
    })
  })

  describe('socket message handling', () => { // eslint-disable-line
    const rpsServer = new RPSServer.RPSServer(null)
    const websocketServer = new MockSock.MockWebSocketServer()
    const ws = new MockSock.MockWebSocket()
    rpsServer.start(websocketServer)

    it('should successfully connect to a game', () => { // eslint-disable-line
      const testUserId = 'testSelectFighter'
      const testGameId = 'testSelectFighterGameId'
      const testUsername = 'testSelectFighterUsername'
      const createGameReponse = rpsServer.createGame(testGameId, testUserId, testUsername)

      ws.reset()
      // This is mimicking a websocket connect
      // Our test starts in the callback for this event
      websocketServer.connect(ws, {
        url: `http://www.rps.com?game_token=${createGameReponse.gameToken}&user_id=${testUserId}`,
        headers: {
          host: 'http://www.rps.com'
        }
      })

      const selectFighterPayload = {
        type: 'select_fighter',
        characterId: RPSEngine.characters[0].id
      }

      ws.sendClientMessage('message', JSON.stringify(selectFighterPayload))

      // Sending this message will send back the selection
      ws.methodCalls.length.should.eql(6)
      ws.methodCalls[5].method.should.eql('send')

      const msgResponseData = JSON.parse(ws.methodCalls[5].args.message)
      msgResponseData.type.should.eql('select_fighter')
      should.exist(msgResponseData.gameData)
    })

    it('should gracefully handle case where game is missing', () => { // eslint-disable-line
      const testUserId = 'testSendMsgMissingGame'
      const testGameId = 'testSendMsgMissingGameGameId'
      const testUsername = 'testSendMsgMissingGameUsername'
      const createGameReponse = rpsServer.createGame(testGameId, testUserId, testUsername)

      ws.reset()
      // This is mimicking a websocket connect
      // Our test starts in the callback for this event
      websocketServer.connect(ws, {
        url: `http://www.rps.com?game_token=${createGameReponse.gameToken}&user_id=${testUserId}`,
        headers: {
          host: 'http://www.rps.com'
        }
      })

      const selectFighterPayload = {
        type: 'select_fighter',
        characterId: RPSEngine.characters[0].id
      }

      // Force this error case by deleting the game from the active games map
      delete rpsServer.activeGames[testGameId]
      ws.sendClientMessage('message', JSON.stringify(selectFighterPayload))

      // Sending this message will send back the selection
      ws.methodCalls.length.should.eql(6)
      ws.methodCalls[5].method.should.eql('close')
      ws.methodCalls[5].args.message.should.eql('Game not found.')
      ws.methodCalls[5].args.errorCode.should.eql(400)
    })

    it('should gracefully handle errors thrown from game logic', () => { // eslint-disable-line
      const testUserId = 'testSendMessageErrorHandlingUserId'
      const testGameId = 'testSendMessageErrorHandlingGameId'
      const testUsername = 'testSendMessageErrorHandlingUsername'
      const createGameReponse = rpsServer.createGame(testGameId, testUserId, testUsername)

      ws.reset()
      // This is mimicking a websocket connect
      // Our test starts in the callback for this event
      websocketServer.connect(ws, {
        url: `http://www.rps.com?game_token=${createGameReponse.gameToken}&user_id=${testUserId}`,
        headers: {
          host: 'http://www.rps.com'
        }
      })

      const selectFighterPayload = {
        type: 'select_fighter',
        characterId: RPSEngine.characters[0].id
      }

      // Monkey patch the active game method so we can force some unexpected error
      const activeGame = rpsServer.activeGames[testGameId]
      activeGame.handlePlayerMessage = function (userId, connection) {
        throw Error('Some unknown exception')
      }
      ws.sendClientMessage('message', JSON.stringify(selectFighterPayload))

      // Sending this message will send back the selection
      ws.methodCalls.length.should.eql(6)
      ws.methodCalls[5].method.should.eql('send')

      const msgResponseData = JSON.parse(ws.methodCalls[5].args.message)
      msgResponseData.type.should.eql('error')
      msgResponseData.message.should.eql('Some unknown exception')
      msgResponseData.code.should.eql(-1)
    })
  })
})
