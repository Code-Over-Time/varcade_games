<template>
    <div>
        <div class="index-screen-image">
        </div>
        <div class="header-wrapper">
            <h1 class="header-text">Varcade Games</h1>
        </div>
        <div>
            <wp-vcg-intro></wp-vcg-intro>
            <wp-homepage-pitch></wp-homepage-pitch>
            <wp-faq></wp-faq>
        </div>
        <wp-footer/>
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
                titleScr,
                signupEmail: ""
            }
        },
        methods: {
            redirectToRegister(){
                this.$router.push({ 
                    path: '/login',
                    query: {
                        'createNew': 'true',
                        'email': this.signupEmail
                    }
                });
            },
        },
        computed: {
          
        },
        mounted: function () {
        },
        created: function () {
        }
    }

</script>

<style>

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
        margin: 0 15%;
        padding-top: 20px;
        width: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 5rem;
        z-index: 10;
    }

    a, a:hover, a:visited {
        color: #ff4848;
    }

    .index-screen-image {
        background: 
            linear-gradient(rgba(0, 0, 0, 0.5), 
            rgba(0, 0, 0, 0.7)),
            black url(/img/bg.73674fee.jpg);
        background-repeat: no-repeat;
        background-position: center;
        height: 100vh;
        max-width: 100vw;
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

    @media only screen 
    and (max-device-height : 1168px) {
        .index-screen-image {
            top: 0px;
        }
    }

    @media (max-device-width : 1940px) {
        .header-wrapper {
            margin: 0 0;
            text-align: center;
        }
    }

    @media (max-device-width : 500px) {
        .header-text {
            font-size: 26px;
        }
    }

</style>
