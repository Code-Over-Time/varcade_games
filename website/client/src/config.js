// Client wide Configuration to be imported into scenes as needed

const clientConfig = {
  serverUrl: 'http://api.varcade.local:8000',
  matchmakerUrl: 'http://matchmaker.varcade.local:5050',
  isDevServer: true
}

// Any production config overrides we need to add can go here

if (process.env.NODE_ENV === 'production') {
  clientConfig.serverUrl = 'https://api.varcade-games.com'
  clientConfig.matchmakerUrl = 'https://matchmaker.varcade-games.com'
}

export { clientConfig }
