import Vue from 'vue'

import './components.js'
import { vcgRouter } from './router.js'
import { vcgStore } from './store.js'
import { loadTokensFromLocalStorage } from './auth.js'

// Generic error handling
Vue.config.errorHandler = function (err, vm, info) {
  alert('Err: ' + err + ', info: ' + info)
  console.error('Error! Message: ', err.message)
  console.error('Exception thrown', err.stack)
}

window.onerror = function (message, source, lineno, colno, error) {
  alert('Err: ' + error + ', msg: ' + message)
  console.error('Error! Message: ', message)
  console.error('Exception thrown', source, lineno)
}

// Load existing auth credentials first thing
// this will allow us to control routing based on auth
loadTokensFromLocalStorage(vcgStore)

const userProfile = localStorage.getItem('_user_profile')
if (userProfile) {
  console.log('Found user profile.')
  vcgStore.commit('setUserProfile', JSON.parse(userProfile))
}
console.log(`Done loading user info, is logged in: ${vcgStore.getters.loggedIn}`)

new Vue({ // eslint-disable-line
  el: '#app',
  router: vcgRouter,
  store: vcgStore
})
