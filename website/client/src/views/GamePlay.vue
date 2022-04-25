<template>

    <div>
        <div class="fs-header row">
            <h1 class="header-text">Varcade Games</h1>
            <button
                class="btn btn-custom header-button ml-auto" 
                @click="redirectToLogin()" 
                type="button">
                    Sign In
            </button>
        </div>  
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
