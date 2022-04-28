<template>

  <div :class="fullScreenHeader ? 'fs-header' : 'header-wrapper'" class="row">
      
      <router-link :to="'/'" class="naked-link">
        <h1 class="header-text">Varcade Games</h1>
      </router-link>     
      
      <div v-if="showLoginOption" class="ml-auto">
        <button
          v-if="!isLoggedIn"
          class="btn btn-custom header-button"
          @click="redirectToLogin()" 
          type="button">
            Sign In
        </button>

        <a v-else href="#" @click="logout()">
            Log Out
        </a>
      </div>
      
  </div>

</template>

<script>

export default {
  name: "wp-top-bar",
  props: {
    showLoginOption: {
      default: true,
      type: Boolean
    },
    fullScreenHeader: {
      default: false,
      type: Boolean
    }
  },
  components: {},
  data () {
      return {
      }
  },
  computed: {
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


  .glow {
    font-size: 48px;
    font-family: "neon-sign", Helvetica, Arial;
    color: #ff4848;
    text-align: center;
    text-shadow: 0 0 15px #f00
  }

  @media screen and (max-width: 1024px) {
    .glow { 
      font-size: 32px;
    }
  }

  @media screen and (max-width: 600px) {
    .glow { 
      font-size: 24px;
    }
  }

</style>
