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

        <div class="root-container">
            <wp-featured-game :featuredGame="featuredGame"/>
            
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
        
        <b-modal 
            id="game-info-modal" 
            hide-footer 
            hide-header
            content-class="game-info-content"
            size="lg">
        </b-modal>

        <wp-footer/>
    </div>
</template>

<script>
    import { runWithRetries, loadActiveGames } from '../utils.js';

    export default {
        name: 'game_portal',
        data () {
            return {
                featuredGame: null
            }
        },
        methods: {
            selectionListener(gameId) {
                console.log(gameId + ' selected');
            },
            redirectToGame (gameId) {
                this.$router.push({ path: `/games/play/${gameId}` });
            },
            showGameInfoModal(gameId) {
                console.log(`Showing info for game-id: ${gameId}`);
                this.$bvModal.show('game-info-modal');
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
                        obj => obj.game_id == 'exrps'
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

    /deep/ .game-info-content {
        background-color: #343a40;
    }

</style>
