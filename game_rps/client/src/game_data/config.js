// Game wide Configuration to be imported into scenes as needed

const gameConfig = {
  baseURL: 'http://games.varcade.local:8090/',
  socketProtocol: 'ws'
}

// Any production config overrides we need to add can go here

if (process.env.NODE_ENV === 'production') {
  gameConfig.baseURL = 'https://games.varcade-games.com/'
  gameConfig.socketProtocol = 'wss'
}

exports.gameConfig = gameConfig
