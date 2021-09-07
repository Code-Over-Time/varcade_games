class RPSEvent {
  constructor (eventType, eventData) {
    this.type = eventType
    this.data = eventData
  }
}

class RPSGameEvent extends RPSEvent {
  static get GAME_STARTED () { return 0 }
  static get GAME_COMPLETE () { return 1 }

  constructor (eventType, eventData) {
    super(eventType, eventData)
    this.classtype = 'RPSGameEvent'
  }
}

class RPSRoundEvent extends RPSEvent {
  static get ROUND_COUNTDOWN () { return 0 }
  static get WEAPON_COUNTDOWN () { return 1 }
  static get STATE_CHANGE () { return 2 }
  static get WEAPONS_SELECTED () { return 3 }
  static get ROUND_FINISHED () { return 4 }
  static get ROUND_STARTED () { return 5 }

  constructor (eventType, eventData) {
    super(eventType, eventData)
    this.classtype = 'RPSRoundEvent'
  }
}

exports.RPSEvent = RPSEvent
exports.RPSRoundEvent = RPSRoundEvent
exports.RPSGameEvent = RPSGameEvent
