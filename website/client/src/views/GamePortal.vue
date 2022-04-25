<template>
    <div>
        <div class="fs-header row">
            <h1 class="header-text">Varcade Games</h1>
            <button
                class="btn btn-custom header-button ml-auto" 
                @click="redirectToLogin()" 
                type="button">
                    Sign In
            </button>
        </div>

        <div class="feature-image" :style="featureBgCss"></div>
        <div class="root-container">
        
            <div class="feature-container row align-items-end" :style="featureCss">
                <div class="feature-info col">

                    <div class="row">
                        <h3 class="col feature-header">FEATURED GAME:</h3>
                    </div>

                    <div class="row">
                        <h1 class="col feature-title">{{ featureTitle}}</h1>
                    </div>
                    
                    <div class="row">
                        <p class="col feature-desc">{{ featureDesc }}</p>
                    </div>

                    <div class="row">
                        <div class="col feature-button">
                            <button class="btn btn-custom" type="button" @click="redirectToGame(featureId)">
                                    Play Now
                            </button>
                        </div>
                        <div class="col feature-button">
                            <button class="btn btn-custom" type="button">
                                    Info
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <wp-game-list 
                heading="Active Games" 
                filterField="game_state" 
                filterValue="ACT" 
                v-bind:playable="true"
                v-bind:selectionListener="selectionListener"
            />

            <wp-game-list 
                heading="Single-Player Games" 
                filterField="game_type" 
                filterValue="SPO|MSP" 
                v-bind:playable="false"
                v-bind:selectionListener="selectionListener"
            />

            <wp-game-list 
                heading="Multi-player Games" 
                filterField="game_type" 
                filterValue="MPO|MSP" 
                v-bind:playable="false"
                v-bind:selectionListener="selectionListener"
            />

            <wp-game-list 
                heading="Coming Soon" 
                filterField="game_state" 
                filterValue="CMS" 
                v-bind:playable="false"
                v-bind:selectionListener="selectionListener"
            />
        </div>
        <wp-footer/>
    </div>
</template>

<script>
    import { runWithRetries, loadActiveGames } from '../utils.js';

    export default {
        name: 'game_portal',
        data () {
            return {
                featureTitle: "",
                featureDesc: "",
                featureId: "",
                featureBgCss: "background: black;",
                featureCss: "display: none;"
            }
        },
        methods: {
            selectionListener(gameId) {
                console.log(gameId + ' selected');
            },
            redirectToGame (gameId) {
                this.$router.push({ path: `/games/play/${gameId}` });
            }
        },
        computed: {

        },
        mounted: function () {
            runWithRetries(loadActiveGames, [this.$store, () => {
                if (this.$store.state.games && this.$store.state.games.length > 0) {
                    let selectedGame = this.$store.state.games.filter(
                        obj => obj.game_id == 'exrps'
                    )[0];
                    this.featureId = selectedGame.game_id;
                    this.featureTitle = selectedGame.name;
                    this.featureDesc = selectedGame.desc;
                    this.featureCss = "display: flex"
                    this.featureBgCss = `background-image: url("${selectedGame.banner_art}")`
                }
            }]); 
        },
        created: function () {
        }
    }

</script>

<style>

    html {
        background: #141414;
        position: relative;
        min-height: 100%;
    }

    body {
        background: transparent;
        color: white;
        margin: 0;
        margin-bottom: 6em; 
    }

    hr {
        background: #ffffff24;
    }

    .root-container {
        margin: 2em 4rem;
        margin-top: 2em;
        margin-bottom: 2em;
        max-width: 100%;
        min-height: 100vh;
    }

    .fs-header {
        margin: 0 4rem;
        padding-top: 20px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 5rem;
        z-index: 10;
    }

    .feature-container {
        margin-bottom: 2rem;
        height: 75vh;
        padding-bottom: 10vh;
        margin-left: 0;
    }

    .feature-info {
        max-width: 25vw;
        padding: 0;
    }

    .feature-header {
        color: #ff4848;
        font-size: 2rem;
        font-weight: bold;
    }

    .feature-title {
        font-size: 5rem;
        font-weight: bold;
        text-shadow: 2px 2px black;
    }

    .feature-desc {
        font-size: 2rem;
        text-shadow: 2px 2px black;
    }

    .feature-image {
        background-repeat: no-repeat;
        mask-image: linear-gradient(to bottom, rgb(0, 0, 0) 90vh, transparent 100vh);
        background-position: top;
        max-width: 100vw;
        height: 100vh;
        position: absolute;
        z-index: -1; 
        background-size: cover;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
    }

    @media screen and (max-width: 1768px) {
        .feature-info {
            max-width: 30vw;
        }

        .feature-header {
            font-size: 1.6rem;
        }

        .feature-title {
            font-size: 4rem;
        }

        .feature-desc {
            font-size: 1.6rem;
        }
    }

    @media screen and (orientation:landscape) {
        .feature-image {
            mask-image: linear-gradient(to bottom, rgb(0, 0, 0) 90vh, transparent 100vh) !important;
            height: 100vh !important;
        }
    }

    @media  screen and (max-width: 1024px),
            screen and (max-height: 1128px) {

        .root-container { 
        }

        .feature-info {
            max-width: 33vw;
            padding: 0;
        }

        .feature-container {
            margin-bottom: 0;
        }

        .feature-header {
            font-size: 1rem;
        }

        .feature-title {
            font-size: 2rem;
        }

        .feature-desc {
            font-size: 1rem;
        }
    }

    @media screen and (max-width: 500px) {

        .fs-header {
            margin: 0 1rem;
            padding-top: 10px;
        }

        .root-container { 
            max-width: 100%;
            margin: 0 1rem 0 1rem;
        }

        .feature-info {
            max-width: 55vw;
        }

        .feature-image {
            mask-image: linear-gradient(to bottom, rgb(0, 0, 0) 30vh, transparent 40vh);
            height: 40vh;
        }

        .feature-container {
            height: 30vh;
            margin-bottom: 0;
        }

        .feature-header {
            font-size: 0.8rem;
        }

        .feature-title {
            font-size: 18px;
        }

        .feature-desc {
            font-size: 0.9rem;
        }
    }

    .loading-spinner {
        left: 0px;
        top: 0px;
        width:100%;
        height:100%;
        display: table;
        text-align: center;
        z-index: 100;
        padding: 5em;
    }

    @font-face {
      font-family: "neon-sign";
      src: local("neon-sign"), url(../fonts/DriveThruNf-6nj1.ttf) format("truetype");
    }

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
