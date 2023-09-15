import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import {  vcgRouter } from './router.js'

import { clientConfig } from './config.js'
import { refreshAuthToken } from './auth.js'

Vue.use(Vuex)

const vcgStore = new Vuex.Store({
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
      vcgRouter.push('/')
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

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response.status === 401) {
      if (!vcgStore.state.isRefreshingToken) {
        vcgStore.commit('setIsRefreshingToken', true)
        console.log('401 Response received from the server - refreshing auth token...')
        refreshAuthToken(vcgStore,
          () => {
            console.log('Auth token refresh processed successful.')
            vcgStore.commit('setIsRefreshingToken', false)
          },
          () => {
            vcgStore.dispatch('logout')
            vcgStore.commit('setIsRefreshingToken', false)
          }
        )
      }
    }
    throw error
  })

export { vcgStore }
