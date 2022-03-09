<template>
    <div>
        <div class="index-screen-image">
        </div>
        <div class="content">
            <wp-top-bar v-bind:display-logout-option="false"/>
            <div class="login-box-container">
                <wp-login-register 
                    title="Welcome Back!" 
                    subtitle="Ready to play some games?"
                    showGuestButton="true"
                />
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'game_index',
        data () {
            return {
            }
        },
        methods: {

        },
        computed: {
          
        },
        mounted: function () {
        },
        created: function () {
        }
    }

</script>

<style scoped>
    .content{
      position: absolute;
      left: 50%; 
      transform: translateX(-50%);
      width: 100%;
    }

    .index-screen-image {
        background-image: url(../assets/images/bg.jpg);
        background-repeat: no-repeat;
        background-position: center;
        height: 100vh;
        width: 100vw;
        position: fixed;
        z-index: -1; 
        background-size: cover;
    }

    .login-box-container {
        display: flex;
        align-items: center;
        margin-left: 10%;
        margin-right: 10%;
        margin-bottom: 10vh;
        margin-top: 30vh;
        height: 80%;
    }

    @media only screen 
    and (min-device-width : 320px) 
    and (max-device-width : 1640px) {
        .login-box-container {
            justify-content: center;
            margin-top: 80vh;
        }
    }
</style>
