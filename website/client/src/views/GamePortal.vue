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
        background: rgb(97,97,97);
        background: linear-gradient(180deg, rgba(97,97,97,1) 0%, rgba(4,4,4,1) 100%); 
        padding-bottom: 5em;
        min-height: 100%;
    }

    body {
        background: transparent;
        color: white;
    }

    hr {
        background: white;
    }

    .root-container {
        margin: auto;
        max-width: 960px;
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

    .header {
        margin-top: 1em;
        margin-bottom: 3em;
    }

    .caption-body {
        margin-bottom: 0;
        text-align: left;
    }


    .collapsible-card {
        cursor: pointer;
    }

    .navbar-custom {
        border-bottom: solid 1px black;
        width: 256px;
    }

    .menu-heading {

    }

    .menu-category {
        font-weight: bold;
        padding-left: 5px;
    }

    .menu-item-category {
        cursor: pointer;
        border-radius: 0 !important;
        background: #f7f7f7;
    }

    .menu-footer {
        position: fixed;
        width: 256px;
        top: calc(100% - 86px);
        line-height: 1.5em;
        padding-bottom: 10px;
        padding-top: 10px;
        text-align:center;
        background-color: #f8f9fa !important;
        border-top: solid 1px black;
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

    .list-group-item {
        background-color: transparent;
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
