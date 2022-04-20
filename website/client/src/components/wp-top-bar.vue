<template>

  <div>

    <b-navbar type="dark" variant="dark" toggleable="lg">
  
      <b-navbar-brand href="#" to="/games">
        <h1 class="glow">Varcade Games</h1>
      </b-navbar-brand>
      
        <b-navbar-toggle v-if="showLogout" target="nav-collapse"></b-navbar-toggle>

        <b-collapse v-if="showLogout" id="nav-collapse" is-nav>

          <b-navbar-nav class="ml-auto">  

              <b-nav-item href="#" v-if="isLoggedIn" v-on:click="logout()">
                  <p>Logout</p>
              </b-nav-item>
              
              <b-nav-item href="#" v-on:click="redirectToLogin()" v-else>
                  <p>Login</p>
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
    },
    isLoggedIn: function() {
      return this.$store.getters.loggedIn
    }
  },
  methods: {

    redirectToLogin: function () {
      this.$router.push({ 
          path: '/login',
          query: {
              'createNew': 'false'
          }
      });
    },
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
