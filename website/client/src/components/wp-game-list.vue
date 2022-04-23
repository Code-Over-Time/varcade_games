<template>

    <div class="game-list">

      <div id="active-games">
        <h2 class="list-heading">{{ heading }}</h2>
        <hr/>
        <div v-if="activeGamesList != null">

          <div v-if="activeGamesList.length > 0">
            <b-container style="margin: 0; padding: 0;">
              <b-row>
                <b-col cols="12">
                  <carousel :perPage="4">
                    
                    <slide v-for="game in activeGamesList" :key="game.game_id">

                      <div class="card game-card" style="width: 18rem;">
                        <div class="card-image">
                          
                          <img 
                            class="card-img-top" 
                            :src="game.cover_art" 
                            alt="Image - Game Cover Art"
                            @click="selectionListener(game.game_id)">
                          
                          <!-- <div v-if="playable" class="image-overlay">
                            <router-link class="icon-link" :to="{ name: 'PlayGame', params: { gameId: game.game_id } }">
                              <font-awesome-icon class="image-overlay-button" :icon="icoPlay" size="4x" />      
                            </router-link>
                          </div> -->

                        </div>
                        <!-- <div class="card-body">
                          <h5 class="card-title">{{ game.name }}</h5>
                          <p class="card-text">{{ game.desc }}</p>
                        </div> -->
                      </div>
                    </slide>
                  </carousel>
                </b-col>
              </b-row>
            </b-container>
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

  // import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { /**faPlay,**/ faSpinner } from '@fortawesome/free-solid-svg-icons'

  export default {
    name: "wp-game-list",
    props: {
      heading: String, 
      filterField: String, 
      filterValue: String, 
      playable: Boolean,
      selectionListener: Function
    },
    components: {},
    data () {
      return {
        // icoPlay: faPlay,  
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
    font-size: 1.2rem;
    font-weight: bold;
  }

  .game-list {
    margin-bottom: 5rem;
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

  .card-image {
    position: relative;
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
