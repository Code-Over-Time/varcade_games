import Vue from 'vue'
import VueRouter from 'vue-router'

import { vcgStore } from './store.js'

// App imports come last or CSS will act funny
import Index from './views/Index.vue'
import Login from './views/Login.vue'
import GamePortal from './views/GamePortal.vue'
import GamePlay from './views/GamePlay.vue'

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


const vcgRouter = new VueRouter({
  routes,
  mode: 'history',
  hashbang: false,
  scrollBehavior: function () {
    return { x: 0, y: 0 }
  }
})

vcgRouter.beforeEach((to, from, next) => {
  console.log(`Navigating to ${to.path}`)
  // already logged in, go straight to games
  if ((to.name === 'Login' || to.name === 'Home') && vcgStore.getters.loggedIn) { 
    next({ name: 'Games' })
  } else {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      // this route requires auth, check if logged in
      // if not, redirect to login page.
      if (!vcgStore.getters.loggedIn) {
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


export { vcgRouter }
