<template>
    <div>
        <div class="index-full-screen-image">
        </div>
        <div class="content">
            <div class="header-wrapper">
                <h1 class="header-text">Varcade Games</h1>
            </div>
            <div class="login-box-container">
                <wp-login-register 
                    title="Welcome Back!" 
                    subtitle="Ready to play some games?"
                    :showRegister="showRegister"
                    :prepopulatedEmail="this.$route.query.email"
                />
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'login',
        data () {
            return {
            }
        },
        methods: {

        },
        computed: {
            showRegister: function () {
                return this.$route.query.createNew;
            }
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

    .index-full-screen-image {
        background: 
            linear-gradient(rgba(0, 0, 0, 0.3), 
            rgba(0, 0, 0, 0.7)),
            black url(/img/bg.73674fee.jpg);
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
        justify-content: center;
        vertical-align: middle;
        height: 80%;
    }

</style>
