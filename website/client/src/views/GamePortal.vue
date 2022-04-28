<template>
    <div>
        <wp-top-bar :fullScreenHeader="true"/>

        <div class="root-container">
            <wp-featured-game :featuredGame="featuredGame" :infoListener="selectionListener"/>
            
            <wp-game-list 
                heading="Active Games" 
                v-bind:filterFields="{game_state: 'ACT'}"
                v-bind:playable="true"
                v-bind:selectionListener="selectionListener"
            />

            <wp-game-list 
                heading="Single-Player Games" 
                v-bind:filterFields="{game_type: 'SPO|MSP', game_state: 'ACT'}"
                v-bind:playable="false"
                v-bind:selectionListener="selectionListener"
            />

            <wp-game-list 
                heading="Multi-player Games" 
                v-bind:filterFields="{game_type: 'MPO|MSP', game_state: 'ACT'}"
                v-bind:playable="false"
                v-bind:selectionListener="selectionListener"
            />

            <wp-game-list 
                heading="Coming Soon" 
                v-bind:filterFields="{game_state: 'CMS'}"
                v-bind:playable="false"
                v-bind:selectionListener="selectionListener"
            />
        </div>
        
        <wp-game-info :selectedGame="selectedGame"/>

        <wp-footer/>
    </div>
</template>

<script>
    import { runWithRetries, loadActiveGames } from '../utils.js';

    export default {
        name: 'game_portal',
        data () {
            return {
                featuredGame: null,
                selectedGame: null
            }
        },
        computed: {
            selectedGameName () {
                if (this.selectedGame) {
                    return this.selectedGame.name;
                }
                return "";
            },
            selectedGameDesc () {
                if (this.selectedGame) {
                    return this.selectedGame.desc;
                }
                return "";
            },
            selectedBgCss () {
                if (this.selectedGame) {
                    return `background-image: url("${this.selectedGame.banner_art}")`
                }
                return "";
            }
        },
        methods: {
            selectionListener(gameId) {
                this.selectedGame = this.$store.state.games.filter(
                        obj => obj.game_id === gameId)[0];
                this.$bvModal.show('game-info-modal');
            },
            redirectToGame (gameId) {
                this.$router.push({ path: `/games/play/${gameId}` });
            },
            redirectToLogin () {
                this.$router.push({ 
                    path: '/login',
                    query: {
                        'createNew': 'false',
                        'email': ''
                    }
                });
            }
        },
        mounted: function () {
            runWithRetries(loadActiveGames, [this.$store, () => {
                if (this.$store.state.games && this.$store.state.games.length > 0) {
                    this.featuredGame = this.$store.state.games.filter(
                        obj => obj.game_id === 'exrps'
                    )[0];
                }
            }]); 
        }
    }

</script>

<style scoped>

    .root-container {
        margin: 2em 4rem;
        margin-top: 2em;
        margin-bottom: 2em;
        max-width: 100%;
        min-height: 100vh;
    }

    @media  screen and (max-width: 1024px),
            screen and (max-height: 1128px) {

        .root-container {
            margin: 2rem 2rem;
        }
    }

    @media screen and (max-width: 500px) {

        .root-container { 
            max-width: 100%;
            margin: 0 1rem 0 1rem;
        }

    }

</style>
