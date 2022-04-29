<template>

    <div>
        
        <b-modal 
            id="matchmaker-modal" 
            hide-footer 
            hide-header 
            content-class="mm-content"
            @hide="notifyMatchmakerClosed"
            v-bind:size="isLoggedIn?'lg':'md'">

            <div>
                
                <div class="container">
                    
                    <div v-if="isLoggedIn">
                        <div class="row title">
                            <div class="col-10" style="padding-left:0;">
                                <h2>Available Games</h2>
                            </div>
                            <div class="col-2 text-right" style="padding-right:0;">
                                <font-awesome-icon 
                                    :icon="icoCloseModal"
                                    class="red-ico"
                                    @click="closeMatchmaker"/>
                            </div>
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
                            <div class="no-games" v-else>
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

                    <div class="row" v-else>
                        <wp-login-register 
                            title="Log in to play online!"
                            subtitle="To play against your friends you must have an account."
                        />
                    </div>
                
                </div>       

            </div> 

        </b-modal>

    </div>

</template>

<script>

    import Matchmaker from '../matchmaker.js';

    import { faUserCircle, faTimes } from '@fortawesome/free-solid-svg-icons'

    export default {
        name: 'matchmaker-modal',
        props: ['gameId'],
        data () {
            return {
                matchmaker: null,
                openGames: [
                    // {creatorName: "kev", game_id: "test"}
                ],
                icoPlayerVS: faUserCircle,
                icoCloseModal: faTimes
            }
        },
        computed: {
            isLoggedIn: function() {
              return this.$store.getters.loggedIn
            }
        },
        methods: {

            initMatchmaker: function () {
                if (!this.matchmaker && !window.getMatchmaker) {
                    const matchmaker = new Matchmaker(this.gameId, this.$store, () => {
                        this.$bvModal.show('matchmaker-modal');
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
                this.$bvModal.hide('matchmaker-modal');
            },

            notifyMatchmakerClosed: function () {
                // might not have access to this 'this' here
                window.getMatchmaker().notifyMatchmakerClosed()
            },
            
            refreshGameList: function () {
                this.matchmaker.getOpenGameList(
                    response => {
                        this.openGames = response;
                    },
                    error => {
                        console.log(`Game creation failed => ${error}`);
                    }
                );
            },
            
            createGame: function () {
                this.matchmaker.createGame(
                    response => {
                        console.log(`Create game => ${response}`);
                        this.matchmaker.notifyJoinedGame(
                            response.target_game_server,
                            this.$store.state.userProfile.user.id, 
                            response.token
                        );
                        // TODO:    This needs to go last or weird stuff happens
                        //          The main menu doesn't clear
                        this.$bvModal.hide('matchmaker-modal');  
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
                        this.matchmaker.notifyJoinedGame(
                            response.target_game_server,
                            this.$store.state.userProfile.user.id, 
                            response.token
                        );
                        // TODO:    This needs to go last or weird stuff happens
                        //          The main menu doesn't clear
                        this.$bvModal.hide('matchmaker-modal');
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
        background: #343a40;
        padding: 2em;
        color: #c9c9c9;
        line-height: 20px;
    }

    /deep/ .mm-content {
        background-color: #343a40;
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
    }

    .no-games {
        text-align: center;
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
