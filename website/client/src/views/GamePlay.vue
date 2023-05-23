<template>
    
    <div>
        <!-- <p>tester</p> -->
        <wp-top-bar/> 
        <wp-active-game :selected-game="selectedGame"/>
        <wp-player-stats :selected-game="selectedGame"/>  
        <wp-game-leaderboard :game-id="gameId"/>
        <!-- <p>tester</p> -->
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

<style scoped>

</style>
