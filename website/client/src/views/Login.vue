<template>
    <div>
        <div class="index-full-screen-image">
        <wp-top-bar :showLoginOption="false"/>
        </div>
        <div class="content">
            <div class="header-wrapper">
                <router-link to="/"  style="text-decoration: none;">
                    <h1 class="header-text">Varcade Games</h1>
                </router-link>
            </div>
            <div class="login-box-container">
                <wp-login-register 
                    title="Welcome Back!" 
                    subtitle="Ready to play some games?"
                    :showRegister="showRegister"
                    :prepopulatedEmail="this.$route.query.email"
                />
            </div>
            <div class="back-link">
                <router-link to="/">
                    &lt; Go Back
                </router-link>
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
            linear-gradient(rgba(0, 0, 0, 0.5), 
            rgba(0, 0, 0, 0.7)),
            black url('~@/assets/images/bg.jpg');
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
        padding: 4rem 4rem 1rem 4rem;
    }

    .back-link {
        text-align: center;
        font-size: 1.2rem;
        margin-bottom: 2rem;
    }

    @media only screen 
    and (max-device-width : 768px) {
        .login-box-container {
            padding: 4rem 1rem;
        }
    }

</style>
