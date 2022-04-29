<template>
    <div>
        <div class="feature-image" :style="featureBgCss"></div>
        <div class="feature-container row align-items-end" :style="featureCss">
            <div class="feature-info col">

                <div class="row">
                    <h3 class="col feature-header">FEATURED GAME:</h3>
                </div>

                <div class="row">
                    <h1 class="col feature-title">{{ featureTitle}}</h1>
                </div>
                
                <div class="row">
                    <p class="col feature-desc">{{ featureDesc }}</p>
                </div>

                <div class="row">
                    <div class="col feature-button">
                        <button class="btn btn-custom feature-btn" 
                                type="button" 
                                @click="redirectToGame(featureId)">
                            <font-awesome-icon :icon="imgPlayButton" class="btn-ico"/>
                            Play
                        </button>
                    </div>
                    <div class="col feature-button">
                        <button class="btn btn-custom feature-btn" 
                                type="button"
                                @click="infoListener(featureId)">
                            <font-awesome-icon :icon="imgInfoButton" class="btn-ico"/>
                            Info
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import { faPlay, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

    export default {
        name: 'featured-game',
        props: {
            featuredGame: Object,
            infoListener: Function
        },
        data () {
            return {
                featureTitle: "",
                featureDesc: "",
                featureId: "",
                featureBgCss: "background: black;",
                featureCss: "display: none;",
                imgPlayButton: faPlay,
                imgInfoButton: faInfoCircle
            }
        },
        watch: {
            featuredGame: {
                immediate: true,
                handler(newValue) {
                    if (newValue) {
                        this.featureId = newValue.game_id;
                        this.featureTitle = newValue.name;
                        this.featureDesc = newValue.desc;
                        this.featureCss = "display: flex"
                        this.featureBgCss = `background-image: url("${newValue.banner_art}")`
                    }
                }
            }
        },
        methods: {
            redirectToGame (gameId) {
                this.$router.push({ path: `/games/play/${gameId}` });
            }
        }
    }
</script>

<style>

    .feature-container {
        margin-bottom: 3rem;
        height: 75vh;
        padding-bottom: 10vh;
        margin-left: 0;
    }

    .feature-info {
        max-width: 25vw;
        padding: 0;
    }

    .feature-header {
        color: #ff4848;
        font-size: 2rem;
        font-weight: bold;
        text-shadow: 1px 1px 2px black;
    }

    .feature-title {
        font-size: 5rem;
        font-weight: bold;
        text-shadow: 1px 1px 2px black;
    }

    .feature-desc {
        font-size: 2rem;
        text-shadow: 1px 1px 2px black;
    }

    .feature-btn {
        width: 100%;
    }

    .feature-image {
        background-repeat: no-repeat;
        mask-image: linear-gradient(to bottom, rgb(0, 0, 0) 90vh, transparent 100vh);
        background-position: top;
        max-width: 100vw;
        height: 100vh;
        position: absolute;
        z-index: -1; 
        background-size: cover;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
    }

    @media screen and (max-width: 1768px) {
        .feature-info {
            max-width: 30vw;
        }

        .feature-header {
            font-size: 1.6rem;
        }

        .feature-title {
            font-size: 4rem;
        }

        .feature-desc {
            font-size: 1.6rem;
        }
    }

    @media screen and (orientation:landscape) {
        .feature-image {
            mask-image: linear-gradient(to bottom, rgb(0, 0, 0) 90vh, transparent 100vh) !important;
            height: 100vh !important;
        }

        .feature-container {
            min-height: 300px !important;
        }
    }

    @media  screen and (max-width: 1024px),
            screen and (max-height: 1128px) {

        .feature-info {
            max-width: 33vw;
            padding: 0;
        }

        .feature-header {
            font-size: 1rem;
        }

        .feature-title {
            font-size: 2rem;
        }

        .feature-desc {
            font-size: 1rem;
        }
    }

    @media screen and (max-width: 500px) {

        .feature-info {
            max-width: 55vw;
        }

        .feature-image {
            mask-image: linear-gradient(to bottom, rgb(0, 0, 0) 30vh, transparent 40vh);
            height: 40vh;
        }

        .feature-container {
            height: 30vh;
            min-height: 250px;
            margin-bottom: 0;
        }

        .feature-header {
            font-size: 0.8rem;
        }

        .feature-title {
            font-size: 18px;
        }

        .feature-desc {
            font-size: 0.9rem;
        }
    }

</style>
