<template>

    <div>    
        <wp-active-game :selected-game="selectedGame"/>
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

</style>
