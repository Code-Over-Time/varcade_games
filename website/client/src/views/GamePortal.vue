<template>
    <div>
        <wp-top-bar/>
        <div class="root-container">
            <div class="header">
                <h1>Home</h1>
            </div>
            <wp-game-list heading="Active Games" filterField="game_state" filterValue="ACT" v-bind:playable="true"/>
            <wp-game-list heading="Coming Soon" filterField="game_state" filterValue="CMS"  v-bind:playable="false"/>
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
            }
        },
        methods: {

        },
        computed: {
        },
        mounted: function () {
            runWithRetries(loadActiveGames, [this.$store, () => {}]); 
        },
        created: function () {
        }
    }

</script>

<style>

    html {
        background: linear-gradient(180deg, rgba(97,97,97,1) 0%, rgba(4,4,4,1) 100%);
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
        background: white;
    }

    .root-container {
        margin: auto;
        margin-top: 2em;
        margin-bottom: 2em;
        max-width: 960px;
        min-height: 100vh;
    }

    @media screen and (max-width: 1024px) {
        .root-container { 
            max-width: 80%;
        }
    }

    @media screen and (max-width: 600px) {
        .root-container { 
            max-width: 90%;
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
