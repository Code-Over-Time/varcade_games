// ######################################################
// #
// #                  IMPORTS
// #
// ######################################################

import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import axios from 'axios'

import { clientConfig } from './config.js'

import Flicking from "@egjs/vue-flicking";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/main.css';

// App imports come last or CSS will act funny
import Index from './views/Index.vue'
import Login from './views/Login.vue'
import GamePortal from './views/GamePortal.vue'
import GamePlay from './views/GamePlay.vue'

// ######################################################
// #
// #                  AXIOS Interceptors
// #
// ######################################################

import { refreshAuthToken, loadTokensFromLocalStorage } from './auth.js'

// ######################################################
// #
// #                  VUES
// #
// ######################################################

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(Flicking);

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


Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.component('wp-info-board', require('./components/wp-info-board.vue').default)
Vue.component('wp-game-list', require('./components/wp-game-list.vue').default)
Vue.component('wp-login-register', require('./components/wp-login-register.vue').default)
Vue.component('wp-top-bar', require('./components/wp-top-bar.vue').default)
Vue.component('wp-footer', require('./components/wp-footer.vue').default)
Vue.component('wp-matchmaker', require('./components/wp-matchmaker.vue').default)
Vue.component('wp-player-stats', require('./components/wp-player-stats.vue').default)
Vue.component('wp-game-leaderboard', require('./components/wp-game-leaderboard.vue').default)
Vue.component('wp-active-game', require('./components/wp-active-game.vue').default)
Vue.component('wp-faq', require('./components/wp-faq.vue').default)
Vue.component('wp-homepage-pitch', require('./components/wp-homepage-pitch.vue').default)
Vue.component('wp-vcg-intro', require('./components/wp-vcg-intro.vue').default)
Vue.component('wp-featured-game', require('./components/wp-featured-game.vue').default)
Vue.component('wp-game-info', require('./components/wp-game-info.vue').default)

// ######################################################
// #
// #                  DATA STORE
// #
// ######################################################

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    accessToken: null,
    refreshToken: null,
    userProfile: null,
    serverUrl: clientConfig.serverUrl,
    matchmakerUrl: clientConfig.matchmakerUrl,
    apiVersion: 'v1',
    games: null,
    isRefreshingToken: false
  },
  mutations: {
    setTokens (state, { access, refresh }) {
      Vue.set(state, 'accessToken', access)
      Vue.set(state, 'refreshToken', refresh)
      localStorage.setItem('_access_token', access)
      localStorage.setItem('_refresh_token', refresh)
      axios.defaults.headers.common.Authorization = 'Bearer ' + access
    },
    setUserProfile (state, profile) {
      Vue.set(state, 'userProfile', profile)
      localStorage.setItem('_user_profile', JSON.stringify(profile))
    },
    setGameList (state, games) {
      Vue.set(state, 'games', games)
      localStorage.setItem('_game_list', JSON.stringify(games))
    },
    setIsRefreshingToken (state, isRefreshing) {
      Vue.set(state, 'isRefreshingToken', isRefreshing)
    }
  },
  actions: {
    logout ({ state }) {
      Vue.set(state, 'accessToken', null)
      Vue.set(state, 'refreshToken', null)
      Vue.set(state, 'userProfile', null)
      localStorage.removeItem('_access_token')
      localStorage.removeItem('_refresh_token')
      localStorage.removeItem('_user_profile')
      delete axios.defaults.headers.common.Authorization
      router.push('/')
    }
  },
  getters: {
    loggedIn: state => {
      return state.accessToken != null && state.userProfile != null
    },
    userProfile: state => {
      return state.userProfile
    },
    games: state => {
      if (state.games) {
        return state.games
      }
      const cachedGameList = localStorage.getItem('_game_list')
      if (cachedGameList) {
        Vue.set(state, 'games', JSON.parse(cachedGameList))
        return state.games
      }
      return null
    }
  }
})

// ######################################################
// #
// #                  ROUTING
// #
// ######################################################

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Index,
    meta: {
      title: 'Varcade Games',
      metaTags: [
        {
          name: 'description',
          content: 'The home page of the community run online arcade.'
        },
        {
          property: 'og:description',
          content: 'The home page of the community run online arcade.'
        }
      ]
    }
  },
  {
    name: 'Login',
    path: '/login',
    component: Login
  },
  {
    name: 'Games',
    path: '/games',
    component: GamePortal
  },
  {
    name: 'PlayGame',
    path: '/games/play/:gameId',
    component: GamePlay,
    props: true
  }
]

const router = new VueRouter({
  routes,
  mode: 'history',
  hashbang: false
})

router.beforeEach((to, from, next) => {
  console.log(`Navigating to ${to.path}`)
  // already logged in, go straight to games
  if ((to.name === 'Login' || to.name === 'Home') && store.getters.loggedIn) { 
    next({ name: 'Games' })
  } else {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      // this route requires auth, check if logged in
      // if not, redirect to login page.
      if (!store.getters.loggedIn) {
        console.log(`Unable to navigate to ${to.path}, user not logged in. Redirecting home.`)
        next({ name: 'Login' })
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response.status === 401) {
      if (!store.state.isRefreshingToken) {
        store.commit('setIsRefreshingToken', true)
        console.log('401 Response received from the server - refreshing auth token...')
        refreshAuthToken(store,
          () => {
            console.log('Auth token refresh processed successful.')
            store.commit('setIsRefreshingToken', false)
          },
          () => {
            store.dispatch('logout')
            store.commit('setIsRefreshingToken', false)
          }
        )
      }
    }
    throw error
  })

// ######################################################
// #
// #                  ROOT VUE INSTANCE
// #
// ######################################################

// Load existing auth credentials first thing - this will allow us to control routing based on auth
loadTokensFromLocalStorage(store)

const userProfile = localStorage.getItem('_user_profile')
if (userProfile) {
  console.log('Found user profile.')
  store.commit('setUserProfile', JSON.parse(userProfile))
}
console.log(`Done loading user info, is logged in: ${store.getters.loggedIn}`)

new Vue({ // eslint-disable-line
  el: '#app',
  router,
  store
})
