<template>

  <div>

    <b-navbar type="dark" variant="dark" toggleable="lg">
  
      <b-navbar-brand href="#" to="/">
        <h1 class="glow">Varcade Games</h1>
      </b-navbar-brand>
      
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>

        <b-navbar-nav v-if="showLogout" class="ml-auto">  

            <b-nav-item href="#" v-on:click="logout()">
                <p>Logout</p>
            </b-nav-item>

        </b-navbar-nav>

      </b-collapse>
    
    </b-navbar>
  
  </div>

</template>

<script>

import { clientConfig }  from '../config.js'

export default {
  name: "wp-top-bar",
  props: [ 
    'displayLogoutOption'
  ],
  components: {},
  data () {
      return {
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
