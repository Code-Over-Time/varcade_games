<template>
    <div>
        <!-- Pitch 1 -->
        <div class="row info justify-content-center">
            <div class="info-content row">
                <div class="info-text col-md-6">
                    <h1 class="info-header">Arcade gaming in your browser.</h1>
                    <h3 class="info-body">
                        Relive the excitement of the arcades, with single and multi player arcade action inside your web browser!
                    </h3>
                </div>
                <div class="col-md-6 info-img-container">
                    <img class="info-img" :src="gameplayScr">
                </div>
            </div>
        </div>

        <!-- Pitch 2 -->
        <div class="row info justify-content-center">
            <div class="info-content row">
                <div class="col-md-6 move-down info-img-container">
                    <img class="info-img" :src="mplayScr">
                </div>
                <div class="info-text col-md-6 move-up">
                    <h1 class="info-header">Face off against your friends.</h1>
                    <h3 class="info-body">
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
                    <h3 class="info-body">
                        Just want to play on your own? No problem, you don't even need an account to enjoy single player gaming.
                    </h3>
                </div>
                <div class="col-md-6 info-img-container">
                    <img class="info-img" :src="titleScr">
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import gameplayScr from '../assets/images/gameplay.png'
    import mplayScr from '../assets/images/multi_player.png'
    import titleScr from '../assets/images/title_screen.png'

    export default {
        name: 'homepage_pitch',
        data () {
            return {
                gameplayScr,
                mplayScr,
                titleScr
            }
        }
    }

</script>

<style scoped>

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

    .info-text {
        margin: auto;
    }

    .info-img {
        text-align: center;
        max-width: 400px;
        width: 100%;
    }

    .info-img-container {
        text-align: center;
    }

    .left-side-item {

    }

    @media only screen 
    and (max-device-width : 768px) {
        .info-header {
            font-size: 2.5rem;
        }

        .info-text {
            text-align: center;
        }

        .info-body {
            font-size: 1.5rem;
        }

        .info-img {
            margin-top: 2rem;
        }

        .move-up {
            order: 1;
        }

        .move-down {
            order: 2;
        }
    }

    @media only screen 
    and (max-device-width : 500px) {
        .info-header {
            font-size: 2rem;
        }

        .info-content {
            padding: 70px 10%;
        }

        .info-body {
            font-size: 1.2rem;
        }

        .info-img {
            margin-top: 2rem;
        }
    }

</style>
