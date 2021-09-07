// Note: Starting error code index at 4000 as it is not reserved
class RPSErrorCodes {
  static get HOST_NOT_READY () { return 4000 }
  static get PLAYER_ALREADY_JOINED () { return 4001 }
  static get HOST_DISCONNECTED () { return 4002 }
  static get PLAYER_DISCONNECTED () { return 4003 }
}

class RPSError extends Error {
  constructor (errorCode, message) {
    super(message)
    this.errorCode = errorCode
  }
}

class ValidationError extends RPSError {

}

module.exports = {
  RPSError: RPSError,
  ValidationError: ValidationError,
  RPSErrorCodes: RPSErrorCodes
}
