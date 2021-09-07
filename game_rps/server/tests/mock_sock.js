/**
*
*   MockSock is a very lightweight mock WebSocket Server and WebSocket implementation
*
*   It is designed to be used as a substitute for the standard JS WS modules
*   and simply tracks socket events and actions that can be used for assertions in tests.
*
**/
class MockWebSocketServer {
  constructor () {
    this.lastAction = null
    this.callbacks = {}
  }

  on (action, callback) {
    this.lastAction = action
    this.callbacks[action] = callback
  }

  connect (ws, req) {
    this.callbacks.connection(ws, req)
  }
}

class MockWebSocket {
  constructor () {
    // We need to be able to register callbacks to simulated the WS
    this.callbacks = {}
    // Track WS method calls for verifications in tests
    this.methodCalls = []
    this.closed = false
  }

  reset () {
    this.callbacks = {}
    this.methodCalls = []
    this.closed = false
  }

  send (message) {
    this.methodCalls.push({
      method: 'send',
      args: {
        message: message
      }
    })
  }

  close (errorCode, msg) {
    this.methodCalls.push({
      method: 'close',
      args: {
        errorCode: errorCode,
        message: msg
      }
    })
    this.closed = true
  }

  on (action, callback) {
    this.methodCalls.push({
      method: 'on',
      args: {
        action: action
      }
    })
    this.callbacks[action] = callback
  }

  sendClientMessage (action, data) {
    this.callbacks[action](data)
  }
}

module.exports = {
  MockWebSocketServer: MockWebSocketServer,
  MockWebSocket: MockWebSocket
}
