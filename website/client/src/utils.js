import axios from 'axios'

const retry = require('retry')

function runWithRetries (func, args) {
  const operation = retry.operation({
    retries: 3,
    factor: 3,
    minTimeout: 1 * 1000,
    maxTimeout: 60 * 1000
  })

  operation.attempt(async (currentAttempt) => {
    console.log(`sending request with retries. Attempt #${currentAttempt}`)
    func(...args, (error) => {
      operation.retry(error)
    })
  })
}

function loadActiveGames (store, callback, onError) {
  console.log('Loading game list.')

  const gameListUrl =
        `${store.state.serverUrl}/games/${store.state.apiVersion}/games/`

  axios.get(gameListUrl).then(resp => {
    console.log(resp.data)
    const activeGamesList = resp.data.results

    if (activeGamesList) {
      console.log(`${activeGamesList.length} games received from the server.`)
      store.commit('setGameList', activeGamesList)
      if (callback) {
        callback(activeGamesList)
      }
    }
  }).catch(error => {
    onError(error)
  })
}

export { loadActiveGames, runWithRetries }
