<template>
    <div>
        <b-modal 
            id="game-info-modal" 
            hide-footer 
            hide-header
            content-class="game-info-content"
            size="lg">

            <div class="info-modal-content selected-image" :style="selectedBgCss">
                <div class="selected-overview">
                    <h1 class="selected-title">{{ selectedGameName }}</h1>
                    <button class="btn btn-custom" 
                            type="button" 
                            @click="redirectToGame(selectedGame.game_id)">
                        Play Now
                    </button>
                    <div>
                        <h2 class="selected-desc">{{ selectedGameDesc }}</h2>
                    </div>
                </div>
                
                <div class="live-info">
                    <b-tabs content-class="mt-3" 
                            active-nav-item-class="text-uppercase font-weight-bold text-white bg-transparent border-0"
                            nav-wrapper-class="text-white border-0 bg-transparent"
                            >
                        <b-tab title="Leaderboard" active>
                            <wp-game-leaderboard :gameId="selectedGameId"/>
                        </b-tab>
                        <b-tab title="Your Stats">
                            <wp-player-stats :selectedGame="selectedGame"/>
                        </b-tab>
                    </b-tabs>
                </div>
            </div>
            
        </b-modal>
    </div>
</template>

<script>

    export default {
        name: 'game_portal',
        props: {
            selectedGame: Object
        },
        data () {
            return {
            }
        },
        computed: {
            selectedGameId () {
                if (this.selectedGame) {
                    return this.selectedGame.game_id;
                }
                return null;
            },
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
                    // return `background-image: url("${this.selectedGame.banner_art}")`
                }
                return "";
            }
        },
        methods: {
            redirectToGame (gameId) {
                this.$router.push({ path: `/games/play/${gameId}` });
            },
        }
    }

</script>

<style scoped>

    /deep/ .game-info-content {
        background-color: #343a40;
    }

    .selected-image {
        /*background-repeat: no-repeat;*/
        /*mask-image: linear-gradient(to bottom, rgb(0, 0, 0) 350vh, transparent 400vh);*/
        /*width: 100%;*/
        /*background-size: 100% auto;*/
        /*overflow: hidden;*/
    }

    .info-modal-content {
    }

    .live-info {
        width: 100%;
        margin-top: 2rem;
        padding: 0 2rem;
    }

    .selected-title {
        font-size: 2rem;
        font-weight: bold;
        max-width: 50%;
    }

    .selected-desc {
        font-size: 1rem;
        font-weight: 400;
        max-width: 50%;
    }

    .selected-overview {
        padding: 4rem 2rem;
    }

</style>
