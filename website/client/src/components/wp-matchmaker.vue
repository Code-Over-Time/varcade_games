<template>

    <div>
        
        <modal name="matchmaker-modal"
                width="800"
                height="600"
                :scrollable="false"
                :reset="true">

            <div id="modelContent" onclick="event.stopPropagation();">
                
                <div class="container">
                
                    <div class="row title">
                        <div class="col">
                            <h2>Available Games</h2>
                        </div>
                        <font-awesome-icon :icon="icoCloseModal" class="col-1 red-ico" @click="closeMatchmaker()"/>
                    
                    </div>

                    <div class="row game-list" v-bind:class="(openGames.length == 0)?'game-list-empty':''">

                        <div v-if="openGames.length > 0" class="game-list-container">
                            <div class="row game-entry" v-for="game in openGames" :key="game.game_id">
                                <div class="col-1">
                                    <font-awesome-icon :icon="icoPlayerVS" size="2x"/>
                                </div>
                                <div class="col">
                                    <h4> {{ game.creator_name }}</h4>
                                </div>                                            
                                <div class="col-4">
                                    <button type="button" 
                                            class="btn btn-custom btn-block" 
                                            @click=joinGame(game.game_id)>
                                        Join Game
                                    </button>
                                </div>
                                <hr/>
                            </div>
                        </div>
                        <div v-else>
                            <h5>THERE ARE NO OPEN GAMES CURRENTLY AVAILABLE.</h5>
                            <h6>Select 'Create Game' to start your own game and wait for others to join.</h6>
                        </div>

                    </div>

                    <div class="buttons row" style="padding: 1em;">

                      <div class="col">
                        <button type="button" class="btn btn-custom btn-block" @click=createGame>Create Game</button>
                      </div>

                      <div class="col">
                        <button type="button" class="btn btn-custom btn-block" @click=refreshGameList>Refresh Games</button>
                      </div>

                    </div>

                </div>        

            </div> 

        </modal>

    </div>

</template>

<script>

    import Matchmaker from '../matchmaker.js';

    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { faUserCircle, faTimes } from '@fortawesome/free-solid-svg-icons'

    export default {
        name: 'matchmaker-modal',
        props: ['gameId'],
        components: {FontAwesomeIcon},
        data () {
            return {
                matchmaker: null,
                openGames: [
                ],
                icoPlayerVS: faUserCircle,
                icoCloseModal: faTimes
            }
        },
        computed: {
        },
        methods: {

            initMatchmaker: function () {
                if (!this.matchmaker && !window.getMatchmaker) {
                    const matchmaker = new Matchmaker(this.gameId, this.$store, () => {
                        this.$modal.show('matchmaker-modal');
                        this.refreshGameList();
                    });
                    
                    this.matchmaker = matchmaker;
                    window.getMatchmaker = function() {
                        return matchmaker;
                    }
                }
            },

            /* Matchmaker Actions*/
            closeMatchmaker: function () {
                this.$modal.hide('matchmaker-modal');
            },
            
            refreshGameList: function () {
                this.matchmaker.getOpenGameList(
                    response => {
                        this.openGames = response;
                    },
                    error => {
                        console.log('Game creation failed => ' + error);
                    }
                );
            },
            
            createGame: function () {
                this.matchmaker.createGame(
                    response => {
                        console.log(`Create game => ${response}`);
                        this.$modal.hide('matchmaker-modal');
                        this.matchmaker.notifyJoinedGame(
                            response.target_game_server,
                            this.$store.state.userProfile.user.id, 
                            response.token
                        );
                    }, 
                    error => {
                        console.log('Game creation failed => ' + error);
                    }
                );
            },

            joinGame: function (targetGameId) {
                this.matchmaker.joinGame(targetGameId,
                    response => {
                        console.log(`Join game => ${response}`);
                        this.$modal.hide('matchmaker-modal');
                        this.matchmaker.notifyJoinedGame(
                            response.target_game_server,
                            this.$store.state.userProfile.user.id, 
                            response.token
                        );
                    }, 
                    error => {
                        console.log(`Game creation failed => ${error}`);
                    }
                );
            }

        },
        created: function () {
            this.initMatchmaker();
        }
    }

</script>

<style scoped>
    
    a {
        color: #ff4848;
    }

    .btn-custom {
        color: #fff;
        font-size: 16px;
        line-height: 24px;
        background-color: #ff48487a;
    }

    .btn-custom:focus {
        border-color: #ff4848;
        box-shadow: 0 0 15px red;
    }

    .container {
        width: 800px;
        height: 600px;
        background: #343a40;
        padding: 2em;
        color: #c9c9c9;
        line-height: 20px;
        box-shadow: 0px 0px 100px 5px #ff4848
    }

    .title {
        font-size: 24px;
        height: 60px;
    }

    .game-list {
        padding: 0 1em 0 1em;
        display: flex;
        justify-content: center;
        height: 400px;
        border: 1px solid #ff4848;
        overflow-y: auto;
        width: 100%;
    }

    .game-list-empty {
        align-items: center;
    }

    .game-list-container {
        width: 100%;
    }

    .game-entry {
        padding: 1em;
    }

    .buttons {
        height: 100px;
        margin-top: 2em;
    }




</style>
