<template>
    <div>
        <b-modal 
            id="game-info-modal" 
            hide-footer 
            hide-header
            content-class="game-info-content"
            size="lg">

            <div class="info-modal-content">
                <div class="selected-image" :style="selectedBgCss">
                    <font-awesome-icon 
                        class="info-close red-ico" 
                        :icon="imgCloseButton" 
                        size="2x"
                        @click="closeModal"
                    />
                </div>
                <div class="selected-overview">
                    <div class="row">
                        <h1 class="col selected-title">{{ selectedGameName }}</h1>
                    </div>
                    
                    <div v-if="isActiveGame" class="row">
                        <div class="col">
                            <button class="btn btn-custom" 
                                    type="button" 
                                    @click="redirectToGame(selectedGame.game_id)">
                                <font-awesome-icon :icon="imgPlayButton" class="btn-ico"/>
                                Play
                            </button>
                        </div>
                    </div>
                    <div v-else class="row">
                        <div class="col">
                            <h3 class="info-coming-soon">COMING SOON!</h3>
                        </div>
                    </div>
                    <hr/>
                    <div class="row">
                        <h2 class="col selected-desc">{{ selectedGameDesc }}</h2>
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
    import { faTimesCircle, faPlay } from '@fortawesome/free-solid-svg-icons'
    
    export default {
        name: 'game_portal',
        props: {
            selectedGame: Object
        },
        data () {
            return {
                imgCloseButton: faTimesCircle,
                imgPlayButton: faPlay
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
                    return `background-image: url("${this.selectedGame.banner_art}")`
                }
                return "";
            },
            isActiveGame () {
                return this.selectedGame && this.selectedGame.game_state === "ACT";
            }
        },
        methods: {
            redirectToGame (gameId) {
                this.$router.push({ path: `/games/play/${gameId}` });
            },
            closeModal () {
                this.$bvModal.hide('game-info-modal');
            }
        }
    }

</script>

<style scoped>

    /deep/ .game-info-content {
        background-color: #343a40;
    }

    /deep/ .modal-body {
        padding: 0;
        padding-bottom: 2rem;
    }

    .selected-image {
        mask-image: linear-gradient(to bottom, rgb(0, 0, 0) 350px, transparent 450px);
        width: 100%;
        height: 450px;
        max-height: 450px;
        background-size: 100%;
        text-align: right;
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
        text-shadow: 2px 2px 2px black;
    }

    .selected-desc {
        font-size: 1rem;
        font-weight: 400;
        max-width: 50%;
    }

    .selected-overview {
        padding: 0 2rem;
        margin-top: -120px;
    }

    .info-close {
        margin: 1rem;
    }

    .info-coming-soon {
        font-weight: bold;
        font-size: 1.2rem;
        color: #ff4848;
        text-shadow: 2px 2px 5px black;
    }

    @media screen and (max-width: 991px) {
        .selected-image {
            mask-image: linear-gradient(to bottom, rgb(0, 0, 0) 200px, transparent 300px);
            height: 300px;
            max-height: 300px;
        }

        .selected-title {
            font-size: 2rem;
            max-width: 100%;
        }

        .selected-desc {
            font-size: 1rem;
            font-weight: 400;
            max-width: 100%;
        }

        .selected-overview {
            padding: 0 2rem;
            margin-top: -120px;
        }
    }

    @media screen and (max-width: 500px) {
        .selected-image {
            mask-image: linear-gradient(to bottom, rgb(0, 0, 0) 100px, transparent 200px);
            height: 200px;
            max-height: 200px;
        }

        .live-info {
            margin-top: 1rem;
            padding: 0 1rem;
        }

        .selected-title {
            font-size: 2rem;
            max-width: 80%;
        }

        .selected-desc {
            font-size: 1rem;
            font-weight: 400;
            max-width: 100%;
        }

        .selected-overview {
            padding: 0 1rem;
        }
    }

</style>
