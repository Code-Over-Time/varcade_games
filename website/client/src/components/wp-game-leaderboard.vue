<template>

    <div>
        <div class="info-box-bg lb-container"  
             v-bind:class="{ 'info-box-empty': !leaderboardLoaded || !leaderboardScoresRecorded }">
            <div v-if="leaderboard">
                <div v-if="leaderboard.length > 0">
                    <p class="lb-info">Number of online wins</p>
                    <div    class="row lb-row" 
                            v-for="(entry, index) in leaderboard" 
                            :key="entry.user_id"
                            :class="(index == 0 ? 'lb-first' : '')">

                        <div class="col lb-num">
                            {{ index + 1 }}.
                        </div>
                        
                        <div class="col lb-name"> 
                            {{ entry.username}}
                        </div>    
                        
                        <div class="col lb-score">
                            {{entry.score}}
                        </div>

                    </div>
                
                </div>
                <div v-else class="info-box-layout">
                    <div class="lb-empty">
                        <h5>No one has registered a score on the leaderboard yet!</h5>
                        <p>Play now to get your name on top!</p>
                    </div>
                </div>
            </div>
            <div v-else class="row">
                <div class="col lb-loading">
                    <p>Loading Leaderboard...</p>
                    <font-awesome-icon class="red-ico" :icon="loadingSpinner" spin size="4x"/>
                </div>
            </div>
        </div>   

    </div>


</template>

<script>

    import axios from 'axios';
    
    import { faSpinner } from '@fortawesome/free-solid-svg-icons'

    import {runWithRetries} from '../utils.js';

    export default {
        name: 'game-leaderboard',
        props: ['gameId'],
        data () {
            return {
                leaderboard: null,
                loadingSpinner: faSpinner
            }
        },
        computed: {
            leaderboardLoaded: function () {
                return this.leaderboard != null
            },
            leaderboardScoresRecorded: function () {
                return this.leaderboard != null && this.leaderboard.length > 0
            }
        },
        methods: {

            loadLeaderboard: function (onError) {
                const leaderboardUrl = 
                    `${this.$store.state.serverUrl}/games/${this.$store.state.apiVersion}/leaderboard/${this.gameId}/`

                axios.get(leaderboardUrl).then(resp => {
                    this.leaderboard = resp.data;
                }).catch((error) => {
                  onError(error)
                });
            }

        },
        
        mounted: function () {
            runWithRetries(this.loadLeaderboard, []);
        }
    }

</script>

<style>

    .lb-row {
        padding: 1rem;
        background-color: #80808099;
        margin: 1rem 1rem;
        border-radius: 10px;
    }

    .lb-first {
        background-color: #c5b358;
        color: black;
    }

    .lb-header {
        color: #ff4848;
        font-size: 18px;
    }

    .lb-container {
        overflow-x: hidden;
        overflow-y: auto;
    }

    .lb-loading {
        text-align: center;
        margin: 2rem;
    }

    .lb-info {
        margin-left: 1rem;
    }

    .lb-empty {
        margin: 1rem;
        text-align: center;
    }

    .lb-num {
        flex-grow: 0;
        font-size: 1.5rem;
        font-weight: 400;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .lb-name {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .lb-score {
        text-align: right;
        font-size: 2rem;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    @media screen and (max-width: 500px) {
        .lb-row {
            padding: 0.5rem;
            margin: 1rem 0rem;
        }

        .lb-info {
            margin-left: 0rem;
        }

    }

</style>
