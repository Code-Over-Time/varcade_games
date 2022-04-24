<template>

    <div class="game-list">

      <div id="active-games">
        <h2 class="list-heading">{{ heading }}</h2>
        <hr/>
        <div v-if="activeGamesList != null">

          <div v-if="activeGamesList.length > 0">
            <div>

              <Flicking :options="{ align: 'prev', circular: true, renderOnlyVisible: true  }">
                <div v-for="game in activeGamesList" :key="game.game_id" style="margin-right:2rem;">
                  <div 
                      class="card-img" 
                      :style="`background-image: url('${game.cover_art}')`" 
                      alt="Image - Game Cover Art"
                      draggable="false"
                      @click="selectionListener(game.game_id)">
                      
                  </div>
                </div>
              </Flicking>

            </div>
          </div>

          <div v-else class="empty-list">
            <div>
              <p style="padding-top: 1em;">No Games Found.</p>
            </div>
          </div> 

        </div>
      
        <div v-else class="loading-content">
          <div>
            <font-awesome-icon class="red-ico" :icon="loadingSpinner" spin size="4x"/>
            <p style="padding-top: 1em;">Loading Games...</p>
          </div>
        </div> 
        
        </div>    

    </div>

</template>

<script>

  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { faSpinner } from '@fortawesome/free-solid-svg-icons'

  export default {
    name: "wp-game-list",
    props: {
      heading: String, 
      filterField: String, 
      filterValue: String, 
      playable: Boolean,
      selectionListener: Function
    },
    components: {
      FontAwesomeIcon
    },
    data () {
      return { 
        loadingSpinner: faSpinner
      }
    },
    computed: {
      activeGamesList: function () {
        if (!this.$store.state.games) {
          return null
        }

        if (this.filterField){
          return this.$store.state.games.filter(
            obj => this.filterValue.split('|').indexOf(obj[this.filterField]) >= 0
          );
        }

        return this.$store.state.games
      }
    },
    mounted: function () {
    },
    created: function () {
    
    }
  }

</script>

<style scoped>

  .list-heading {
    font-size: 2rem;
    font-weight: bold;
  }

  .game-list {
    margin-bottom: 6rem;
  }

  .game-list-container {
    padding: 0;
    margin: 0;
    max-width: 100%;
    width: 100%;
  }

  .loading-content {
    padding: 1em;
    display: flex;
    justify-content: center;
    text-align: center;
  }

  .loading-content {
    padding: 1em;
    display: flex;
    justify-content: center;
    text-align: center; 
  }

  .game-list-slide {
/*    flex-shrink: unset;
    flex-basis: unset;
    padding-right: 1rem;*/
  }
  
  .game-card{
    background: transparent;
    border: none;
    padding-top: 0.5em;
    margin: 0;
  }

  .card-body {
    padding: 0;
    margin-top: 0.5em;
  }

  .card-img {
    min-width: 400px;
    min-height: 225px;
    width: 100%;
    height: 100%;
    background-size: 400px 225px;
  }

  .icon-link {
    color: #ff4848;
  }

  .image-overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    transition: .5s ease;
    background: rgba(0, 0, 0, 0.5);
  }

  .image-overlay-button {
    margin: auto;
    display: block;
    height: 100%;
  }

  .card:hover .image-overlay {
    opacity: 1;
  }

</style>
