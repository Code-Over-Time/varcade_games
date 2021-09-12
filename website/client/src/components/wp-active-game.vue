<template>

    <div>
        <!-- Game canvas is injected into this element -->
        <div class="game-container">
            <div v-if="!gameLoaded">
                <font-awesome-icon class="red-ico" :icon="loadingSpinner" spin size="4x"/>
            </div>
            <div v-show="gameLoaded" id="gameContainer" ref="gameContainer"></div>
        </div>

        <div v-if="selectedGame" class="game-desc">
            <div class="row">
                <div class="col-2">
                    <img :src="selectedGame.cover_art" class="img-fluid" max-width="256" alt="Image - Game Cover Art">
                </div>
                <div class="col">
                    <h2>{{ selectedGame.name }}</h2>
                    <hr/>
                    <p>
                        {{ selectedGame.desc }}
                    </p>
                </div>
            </div>
        </div>

        <wp-matchmaker :game-id="gameId"/>

    </div>

</template>

<script>
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { faSpinner } from '@fortawesome/free-solid-svg-icons'

    export default {
        name: 'active-game',
        props: {
            'selectedGame': Object
        },
        components: {FontAwesomeIcon},
        data () {
            return {
                loadingSpinner: faSpinner,
                loadingInterval: null,
                gameLoaded: false
            }
        },
        computed: {
            gameId: function () {
                return this.selectedGame.game_id
            }
        },
        methods: {

            loadGameData: function () {
                if (this.gameScriptLoaded()) {
                    console.log('Will not load game - it appears to be loaded already')
                }
                else{
                    let gameScript = document.createElement('script');
                    gameScript.setAttribute('src', this.selectedGame.client_url);
                    gameScript.setAttribute('type', 'text/javascript');
                    gameScript.setAttribute('id', `_game_instance_${this.gameId}`)
                    document.body.appendChild(gameScript);

                    this.loadingInterval = setInterval(() => {
                        console.log("Game loading...");
                        const gameContainerElement = document.getElementById('gameContainer') 
                        this.gameLoaded = gameContainerElement != null && 
                            gameContainerElement.firstChild != null
                        if (this.gameLoaded) {
                            clearInterval(this.loadingInterval);
                            console.log("Game loaded.");
                            //uncomment to add glow - make this a per game setting?
                            //const ref = this.$refs['gameContainer']
                            //ref.style.boxShadow = '0px 0px 100px 5px #ff4848';
                        }
                    }, 500);
                }
            },

            gameScriptLoaded: function() {
                if (document.getElementById(`_game_instance_${this.gameId}`) != null) {
                    return true;
                }
                return false
            },

        },
        destroyed: function () {
            // Very important to clean this up - navigating away and back can lead to
            // multiple scripts being loaded, and browsers will hate you
            console.log(`Unloading game: ${this.gameId}...`)
            var gameScript = document.getElementById(`_game_instance_${this.gameId}`);
            if (gameScript != null) {
                document.body.removeChild(gameScript);
                console.log('Game unloaded.')
            }
            if (this.loadingInterval != null) {
                clearInterval(this.loadingInterval);
            }
        },
        created: function () {
            // console.log('GamePlay: Mounted game play view.');
            // if (this.$store.state.games.length == 0) {
            //     console.log('GamePlay: No game data loaded - requesting from server...');
            //     loadActiveGames(this.$store, this.loadGameData);
            // } else {
            // }
            this.loadGameData();
        }
    }

</script>

<style>


</style>
