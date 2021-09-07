<template>

  <div>
    <b-navbar type="dark" variant="dark">
  
      <b-navbar-brand href="#" to="/">
        <h2 class="glow">Varcade Games</h2>
        <span v-if="showDevServerWarning" class="dev-server-warning">
          Warning: This is a dev server and will be unstable / reset periodically.
        </span>
      </b-navbar-brand>
      
      <b-navbar-nav v-if="showLogout" class="ml-auto">  

          <b-nav-item href="#" v-on:click="logout()">
              <font-awesome-icon :icon="icoLogout" style="color:#ff4848" title="Logout" alt="logout-icon" size="2x"/>
          </b-nav-item>

      </b-navbar-nav>
    
    </b-navbar>
  
  </div>

</template>

<script>

import { clientConfig }  from '../config.js'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

export default {
  name: "wp-top-bar",
  props: [ 
    'displayLogoutOption'
  ],
  components: {FontAwesomeIcon},
  data () {
      return {
          icoLogout: faSignOutAlt
      }
  },
  computed: {
    showLogout: function() {
      return this.displayLogoutOption == null || this.displayLogoutOption === "true";
    },
    showDevServerWarning: function() {
      return clientConfig.isDevServer;
    }
  },
  methods: {

    logout: function() {
      return this.$store.dispatch('logout')
    }

  }
}

</script>

<style scoped>

.dev-server-warning {
  font-size: 16px;
}

</style>
