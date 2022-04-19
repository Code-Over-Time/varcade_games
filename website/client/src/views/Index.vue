<template>
    <div>
        <div class="index-screen-image">
        </div>
        <div class="header-wrapper">
            <h1 class="header-text">Varcade Games</h1>
        </div>
        <div>

            <!-- Image and into text -->
            <div class="intro row justify-content-center">
                <div class="intro-text">
                    <h1 class="intro-header">Online gaming from the comfort of your browser.</h1>
                    <h2 class="intro-sub-header">Play anywhere, with anyone.</h2>
                    <form class="sign-up">
                        <h3 class="intro-form-text">Ready to play? You can sign up here to enjoy full access to multi-player gaming, or log in as a guest to try out the single player experience.</h3>
                        <div class="input-group sign-up-email">
                            <input 
                                class="form-control sign-up-email-input"
                                type="text" 
                                placeholder="Enter your email address">
                            <div class="input-group-append">
                                <button class="btn btn-custom" type="button">
                                    <span>
                                        Get Started >
                                    </span>
                                </button>
                            </div>
                        </div>
                    </form>
                    <div class="guest-entry">
                        <a href="/games">Continue as a guest ></a>
                    </div>
                </div>
            </div>

            <!-- Pitch 1 -->
            <div class="row info justify-content-center">
                <div class="info-content row">
                    <div class="info-text col-md-6">
                        <h1 class="info-header">Arcade gaming in your browser.</h1>
                        <h3 class="info-body">
                            Relive the excitement of the arcades, with single and multi player arcade action inside your web browser!
                        </h3>
                    </div>
                    <div class="col-md-6">
                        <img class="info-img" :src="gameplayScr">
                    </div>
                </div>
            </div>

            <!-- Pitch 2 -->
            <div class="row info justify-content-center">
                <div class="info-content row">
                    <div class="col-md-6">
                        <img class="info-img" :src="mplayScr">
                    </div>
                    <div class="info-text col-md-6">
                        <h1 class="info-header">Face off against your friends.</h1>
                        <h3>
                            With leaderboards and gameplay stats, you can track who is really winning, across multiple dimensions!
                        </h3>
                    </div>
                </div>
            </div>

            <!-- Pitch 3 -->
            <div class="row info justify-content-center">
                <div class="info-content row">
                    <div class="info-text col-md-6">
                        <h1 class="info-header">No account needed.</h1>
                        <h3>
                            Just want to play on your own? No problem, you don't even need an account to enjoy single player gaming.
                        </h3>
                    </div>
                    <div class="col-md-6">
                        <img class="info-img" :src="titleScr">
                    </div>
                </div>
            </div>


            <!-- <div class="login-box-container">
                <wp-login-register 
                    title="Welcome Back!" 
                    subtitle="Ready to play some games?"
                    showGuestButton="true"
                />
            </div> -->
        </div>
    </div>
</template>

<script>
    import gameplayScr from '../assets/images/gameplay.png'
    import mplayScr from '../assets/images/multi_player.png'
    import titleScr from '../assets/images/title_screen.png'


    export default {
        name: 'game_index',
        data () {
            return {
                gameplayScr,
                mplayScr,
                titleScr
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

    .btn-custom {
        color: #fff;
        font-size: 18px;
        font-weight: bold;
        line-height: 24px;
        background-color: #ff4848;
    }
    
    .header-text {
        font-size: 32px;
        font-family: "neon-sign", Helvetica, Arial;
        color: #ff4848;
        text-shadow: 0 0 15px #f00
    }

    .header-wrapper {
        position: relative;
        max-width: 1920px;
        margin: 0 auto;
        padding-top: 20px;
        width: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 5rem;
        z-index: 10;
    }

    .intro {
        text-align: center;
        padding: 70px 45px;
        border-bottom: 8px solid #222;
    }

    .intro-header {
        max-width: 1024px;
        font-weight: bold;
        text-shadow: 2px 2px black;
        font-size: 4rem;
    }

    .intro-sub-header {
        margin: 1rem auto;
        text-shadow: 2px 2px black;
    }

    .intro-form-text {
        font-size: 1.2rem;
        text-shadow: 2px 2px black;
    }

    .intro-text {
        max-width: 800px;
        padding: 75px 0;
    }

    .info {
        padding: 1rem 1rem;
        margin: auto;
        border-bottom: 8px solid #222;
        background: black;
    }

    .info-content {
        padding: 70px 45px;
        max-width: 1200px;
    }

    .info-header {
        font-weight: bold;
        font-size: 3.1rem;
        line-height: 1.1;
        margin-bottom: .5rem;
    }

    .info-body {
        font-size: 1.625rem;
        font-weight: 400;
    }

    .info-img {
        text-align: center;
        max-width: 100%;
    }

    .sign-up {
        padding-top: 1rem;
    }

    .sign-up-email {
        padding-top: 1rem;
        max-width: 640px;
        margin: auto;
    }

    .sign-up-email-input {
        height:  70px;
        font-size: 1.3rem;
    }

    a {
        color: #ff4848;
    }

    .guest-entry {
        padding: 1em;
        font-size: 1.2rem;
    }

    .index-screen-image {
        background: 
            linear-gradient(rgba(0, 0, 0, 0.7), 
            rgba(0, 0, 0, 1.0)),
            black url(/img/bg.73674fee.jpg);
        background-repeat: no-repeat;
        background-position: center;
        height: 100vh;
        width: 100vw;
        position: absolute;
        z-index: -1; 
        background-size: cover;
        position: absolute;
        top: -250px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
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
