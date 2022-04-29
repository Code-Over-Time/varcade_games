<template>

    <div class="game-list">

      <div id="active-games">
        <h2 class="list-heading">{{ heading }}</h2>
        <hr/>
        <div v-if="activeGamesList != null">

          <div v-if="activeGamesList.length > 0">
            
              <Flicking :options="{ 
                  align: 'prev', 
                  circular: false, 
                  bound: true, 
                  moveType: ['freeScroll', { stopAtEdge: true }],
                  renderOnlyVisible: true,
                  preventClickOnDrag: true
                }">
                
                <div v-for="game in activeGamesList" :key="game.game_id" class="game-div">
                  <div 
                      class="card-img" 
                      :style="`background-image: url('${game.cover_art}')`" 
                      alt="Image - Game Cover Art"
                      @click="selectionListener(game.game_id)">
                      
                  </div>
                </div>
              </Flicking>

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

  import { faSpinner } from '@fortawesome/free-solid-svg-icons'
  
  export default {
    name: "wp-game-list",
    props: {
      heading: String, 
      filterFields: Object, 
      playable: Boolean,
      selectionListener: Function
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

        if (this.filterFields){
          let filtered = this.$store.state.games; 
          for (const [filterField, filterValues] of Object.entries(this.filterFields)) {
            filtered = filtered.filter(
              obj => filterValues.split('|').indexOf(obj[filterField]) >= 0
            );
          }
          return filtered;
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

  @import url("../../node_modules/@egjs/flicking/dist/flicking.css");

  .list-heading {
    font-size: 2rem;
    font-weight: bold;
  }

  .game-list {
    margin-bottom: 6rem;
  }

  .loading-content {
    padding: 1em;
    display: flex;
    justify-content: center;
    text-align: center;
  }

  .card-img {
    min-width: 400px;
    min-height: 225px;
    width: 100%;
    height: 100%;
    background-size: 400px 225px;

  }

  .game-div {
    margin-right: 1rem;
  }

  @media screen and (max-width: 1768px) {
    .card-img {
      min-width: 240px;
      min-height: 135px;
      background-size: 240px 135px;
    }

    .game-list {
      margin-bottom: 3rem;
    }

    .list-heading {
      font-size: 1.5rem;
    }
  }

  @media screen and (max-width: 500px) {
    .card-img {
      min-width: 167px;
      min-height: 94px;
      background-size: 167px 94px;
    }

    .game-div {
      margin-right: 0.3rem;
    }

    .game-list {
    }

    .list-heading {
      font-size: 1.2rem;
    }
  }


</style>
