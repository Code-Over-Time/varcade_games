<template>

    <div>
        <wp-top-bar/>
        <div class="root-container">
            
            <wp-active-game :selected-game="selectedGame"/>

            <div class="row">
            
                <div class="col">
                    <wp-player-stats :selected-game="selectedGame"/>  
                </div>

                <div class="col">
                    <wp-game-leaderboard :game-id="gameId"/>
                </div>
            
            </div>

        </div>
        <wp-footer/>
    </div>

</template>

<script>

    export default {
        name: 'game_play',
        props: ['gameId'],
        data () {
            return {
            }
        },
        computed: {
            selectedGame: function () {
                return this.$store.getters.games.find(obj => obj.game_id == this.gameId)
            }
        }
    }

</script>

<style>

    .game-container {
        margin: 5em;
        justify-content: center;
        display: flex;
    }

    .red-ico {
        color: #ff4848
    }
    
    .game-desc {
        margin-bottom: 2em;
    }

    .info-box-bg {
        background: #dbdbdb1f;
        padding: 1em;
        height: 20em;
    }

    .info-box-empty {
        align-items: center;
        display: flex;
        justify-content: center;
        text-align: center;
    }

    .info-box-layout {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

</style>
