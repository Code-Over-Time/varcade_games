import Vue from 'vue'

import Flicking from "@egjs/vue-flicking"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/main.css'

import vueCountryRegionSelect from 'vue-country-region-select'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(Flicking)
Vue.use(vueCountryRegionSelect)

Vue.component('font-awesome-icon', FontAwesomeIcon)

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

Vue.component('wp-user-info',  require('./components/profile/wp-user-info.vue').default)
Vue.component('wp-security',  require('./components/profile/wp-security.vue').default)

