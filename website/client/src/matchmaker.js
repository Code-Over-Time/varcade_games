import axios from 'axios'

class Matchmaker {
  constructor (gameId, dataStore, onDisplay) {
    this.gameId = gameId
    this.displayCallback = onDisplay
    this.dataStore = dataStore
  }

  /*
    tokenListener: A callback that will be called with a token
    and game info required to join the game.
  */
  showMatchmaker (tokenListener, closeListener) {
    console.log("Matchmaker: Called 'showMatchmaker.")
    this.tokenListener = tokenListener
    this.closeListener = closeListener
    this.displayCallback()
  }

  notifyJoinedGame (gameServerUrl, userId, token) {
    this.tokenListener(gameServerUrl, userId, token)
    this.closeListener = null  // at this point we don't want to accidentally give clients mixed signals
  }

  notifyMatchmakerClosed () {
    if (this.closeListener) {
      this.closeListener()
    }
  }

  getOpenGameList (onSuccess, onError) {
    console.log('Matchmaker: Fetching list of open games')

    const gameListUrl = this.dataStore.state.matchmakerUrl +
      '/game_lobby/' + this.gameId + '/open_games'

    axios.get(gameListUrl).then(resp => {
      console.log('Matchmaker: Get open games response =>' + resp.data)
      onSuccess(resp.data)
    }).catch(error => {
      console.log('Matchmaker: Error fetching open games =>' + error)
      onError(error)
    })
  }

  createGame (onSuccess, onError) {
    console.log('Matchmaker: Creating a new game')

    const createGameUrl = this.dataStore.state.matchmakerUrl +
      '/game_lobby/' + this.gameId + '/create_game'

    const postData = {
      game_type: 0,
      num_players: 2,
      creater_id: this.dataStore.state.authToken // TODO: Profile service
    }

    axios.post(createGameUrl, postData).then((resp) => {
      console.log('Matchmaker: Created a new game on the game server: ' + resp.data)
      onSuccess(resp.data)
    }).catch((error) => {
      console.log('Matchmaker: Error creating a new game on the game server: ' + error)
      onError(error)
    })
  }

  joinGame (targetGameId, onSuccess, onError) {
    console.log('Matchmaker: Joining game, game ID => ' + targetGameId)

    const joinGameUrl = this.dataStore.state.matchmakerUrl +
      '/game_lobby/' + this.gameId + '/join_game/' + targetGameId

    axios.post(joinGameUrl).then(resp => {
      console.log('Matchmaker: Successfully joined game => ' + resp.data)
      onSuccess(resp.data)
    }).catch(error => {
      console.log('Matchmaker: error trying to join a game => ' + error)
      onError(error)
    })
  }
}

export default Matchmaker
