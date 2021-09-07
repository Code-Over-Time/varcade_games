<template>

  <div>
    <b-sidebar id="sidebar" bg-variant="dark" text-variant="light" shadow>
        <template #footer>
            <div class="d-flex bg-dark text-light align-items-center px-3 py-2">
                <div class="mr-auto">
                  <b-link href="#" @click="logout">Log Out</b-link>
                </div>
            </div>
        </template>
        
        <div>
          

          <h5 class="h5">
            Username: {{ userProfile.user.username }}
          </h5>

          <p>
            Level: {{ userProfile.level }}
          </p>

        </div>

    </b-sidebar>

  </div>

</template>

<script>

export default {
  name: "wp-side-menu",
  props: [  ],
  computed: {
    userProfile: function () {
      return this.$store.getters.userProfile;
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

</style>
