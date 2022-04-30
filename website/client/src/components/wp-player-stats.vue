<template>

    <div>
        <div class="info-box-bg" v-bind:class="{ 'info-box-empty': !statsLoaded || !statsRecorded }">
            <div v-if="playerGameStats">
                <div v-if="statsRecorded" class="stats-container">
                    <div class="row" v-for="value in playerGameStats" :key="`${ value }`">
                        <div class="col">
                            <h3 class="stat-title">{{ value.statName }}</h3>
                        </div>
                        <div class="col ml-auto">
                            <h2 class="stat-value">{{ value.statValue }}</h2>
                        </div>
                    </div>
                </div>
                <div v-else class="row info-box-layout justify-content-center">
                    <div class="col stats-empty">
                        <h5>Looks like you haven't played this game online yet, what are you wating for?</h5>
                        <p>As you play your stats will be updated here.</p>
                    </div>
                </div>
            </div>
            <div v-else class="row">
                <div class="col stats-loading">
                    <p>Loading your stats...</p>
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
        name: 'player-stats',
        props: {
            'selectedGame': Object
        },
        data () {
            return {
                playerGameStats: null,
                translationData: null,
                loadingSpinner: faSpinner
            }
        },
        computed: {
            statsLoaded: function () {
                return this.playerGameStats != null
            },
            statsRecorded: function () {
                return this.playerGameStats != null && this.playerGameStats.length > 0
            }
        },
        methods: {

            loadPlayerGameStats: function (onError) {
                const statsUrl = `${this.$store.state.serverUrl}/games/${this.$store.state.apiVersion}/stats/${this.selectedGame.game_id}/`;

                const customStatsUrl = this.selectedGame.stats_config
                axios.get(customStatsUrl).then(resp => {
                    const statsFormat = resp.data;
                    
                    axios.get(statsUrl).then(resp => {
                        this.processCustomStats(statsFormat, resp.data)
                    }).catch((error) => {
                      onError(error)
                    });

                }).catch((error) => {
                  console.error('Unable to download game specific stats format file.')
                  onError(error)
                });
            },
            processCustomStats: function (statsFormat, statsData) {
                this.playerGameStats = []
                if (statsFormat && statsData) {
                    statsFormat.stat_ordering.forEach(entry => {
                        if (statsData[entry]) {
                            this.playerGameStats.push(
                                {
                                    statName: statsFormat.strings.en[entry],
                                    statValue: statsData[entry]
                                }
                            )
                        }
                    })
                }
                else {
                    console.error("Unable to process custom stats - format or stats data missing.")
                }
            }
        },

        mounted: function () {
            runWithRetries(this.loadPlayerGameStats, []);
        }
    }

</script>

<style>

    .stats-container {
        padding: 1rem;
    }

    .stat-title {
        font-size: 1.2rem;
        font-weight: 400;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: bold;
        text-align: right;
    }

    .stats-empty {
        margin: 1rem;
        text-align: center;
        max-width: 70%;
    } 

    .stats-loading {
        text-align: center;
        margin: 2rem;
    }

</style>
