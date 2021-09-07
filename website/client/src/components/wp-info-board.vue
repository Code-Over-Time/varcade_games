<template>

    <div class="card welcome-board drop-shadow">
        <div class="card-header">
            Welcome to The Webcade!
        </div>
        <div class="card-body">
            
            <h5 class="h5">
              Classic arcade style, online multiplayer action, puzzling puzzlers!
            </h5>

            <p class="card-text">
              A community driven approach to creating and playing 
            </p>


            <div class="row gallery-container">

              <div class="col-md-4">
                <div class="img-thumbnail">
                    <img src="@/assets/images/promo/game_0.jpg" alt="" style="width:100%">
                    <div class="figure-caption">
                      <h4>Multi Player Action</h4>
                    </div>
                </div>
              </div>

              <div class="col-md-4">
                <div class="img-thumbnail">
                    <img src="@/assets/images/promo/game_1.jpg" alt="" style="width:100%">
                    <div class="figure-caption">
                      <h4>Puzzlers</h4>
                    </div>
                </div>
              </div>

              <div class="col-md-4">
                <div class="img-thumbnail">
                    <img src="@/assets/images/promo/game_2.jpg" alt="" style="width:100%">
                    <div class="figure-caption">
                      <h4>Platforming</h4>
                    </div>
                </div>
              </div>

            </div>

            <p class="card-text">
                To get started create and account or log in. You'll get 10 free tokens on us to get going!
            </p>

        </div>
    </div>

</template>

<script>

export default {
  name: "wp-info-board",
  props: [  ]
}

</script>

<style scoped>

  .welcome-board {
      margin: 1em;
  }

  .gallery-container {
      padding-bottom: 1em;
  }

  .img-thumbnail {
    background-color: #586e7591;
    border: none;
    font-weight: bold;
  }

  .figure-caption {
    color: #b58900;
    text-align: center;
    padding-top: 0.5em;
  }

</style>
