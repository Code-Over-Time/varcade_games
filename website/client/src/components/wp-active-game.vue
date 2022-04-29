<template>

    <div class="game-root"> 
        <div :class="gameLoaded ? 'loaded' : 'loading'" class="row align-items-center">
            <font-awesome-icon class="col red-ico" :icon="loadingSpinner" spin size="4x"/>
        </div>
        <div class="game-container">
            <!-- Game canvas is injected into this element -->
            <div id="gameContainer" ref="gameContainer"></div>
        </div>
        <wp-matchmaker :game-id="gameId"/>
    </div>

</template>

<script>
    import { faSpinner } from '@fortawesome/free-solid-svg-icons'

    export default {
        name: 'active-game',
        props: {
            'selectedGame': Object
        },
        data () {
            return {
                loadingSpinner: faSpinner,
                loadingInterval: null,
                gameLoaded: false,
                destroyListener: null
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
                    // Game client should register a callback that VCG can
                    // call to do any required cleanup when navigating away
                    // from the page
                    window.registerGameUnloadedListener = (callback) => {
                        this.destroyListener = callback
                    }

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

            if (this.destroyListener) {
                console.log("Current game has a unload listener - calling.")
                this.destroyListener()
            }

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
            this.loadGameData();
        }
    }

</script>

<style scoped>

    .loading {
        position: absolute;
        width: 100vw;
        height: 100vh;
        z-index: 10;
        top:  0;
        left: 0;
    }

    .loaded {
        display: none;
    }

    .game-root {
        height: 100vh;
        display: flex;
        margin: 2rem 0;
        justify-content: center;
    }

    .game-container {
        max-width: 960px;
        max-height: 640px;
        width: 100%;
        height: 100%;
    }
    
</style>
