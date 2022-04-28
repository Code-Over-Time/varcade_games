<template>

    <div>
        <wp-top-bar/> 
        <wp-active-game :selected-game="selectedGame"/>
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
