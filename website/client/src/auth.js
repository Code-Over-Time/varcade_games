import axios from 'axios'

function sendAuthRequest (store, url, data, onSuccess, onError) {
  console.log('Attempting auth request...')
  axios.post(url, data).then(
    resp => {
      processAuthToken(store, resp.data)
      onSuccess()
    }).catch((error) => {
    if (error.response) {
      onError(error.response.status, error.response.data)
    }
  }
  )
}

function login (store, email, password, onSuccess, onError) {
  console.log('Attempting to login user...')
  const loginUrl = store.state.serverUrl + '/token/'
  const postData = {
    email: email,
    password: password
  }
  sendAuthRequest(store, loginUrl, postData, onSuccess, onError)
}

function register (store, email, username, password, onSuccess, onError) {
  console.log('Attempting to register user...')
  const registrationUrl = store.state.serverUrl + '/register/'
  const postData = {
    username: username,
    email: email,
    password: password
  }
  sendAuthRequest(store, registrationUrl, postData, onSuccess, onError)
}

function refreshAuthToken (store, onSuccess, onError) {
  const refreshUrl = store.state.serverUrl + '/token/refresh/'
  console.log('Refreshing auth token...')
  axios.post(refreshUrl, { refresh: store.state.refreshToken }).then(resp => {
    processAuthToken(store, resp.data)
    onSuccess()
  }).catch((error) => {
    // We were unable to refresh our token
    onError(error)
  })
}

function processAuthToken (store, responseData) {
  const accessToken = responseData.access
  const refreshToken = responseData.refresh
  if (accessToken == null) {
    console.log('Unable to read auth token from the server response. ',
            `Response data: ${responseData}`)
    return
  }
  store.commit('setTokens', { access: accessToken, refresh: refreshToken })
  console.log('Login successful, auth tokens stored.')
}

function loadTokensFromLocalStorage (store) {
  console.log('Trying to load user info from local storage...')
  const accessToken = localStorage.getItem('_access_token')
  const refreshToken = localStorage.getItem('_refresh_token')
  if (accessToken) {
    console.log('Found stored auth tokens.')
    store.commit('setTokens', { access: accessToken, refresh: refreshToken })
  }
}

export { register, login, refreshAuthToken, loadTokensFromLocalStorage }
