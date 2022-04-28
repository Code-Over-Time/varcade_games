<template>
    <!-- Image and into text -->
    <div class="intro row justify-content-center">
        <div class="intro-text">
            <h1 class="intro-header">Online gaming from the comfort of your browser.</h1>
            <h2 class="intro-sub-header">
                Play anywhere, with anyone.
            </h2>
            <div class="sign-up">
                <h3 class="intro-form-text">
                    Ready to play? You can sign up here to enjoy full access to multi-player gaming, or log in as a guest to try out the single player experience.
                </h3>
                <div class="input-group sign-up-email">
                    <input 
                        class="form-control sign-up-email-input"
                        type="text" 
                        placeholder="Enter your email address"
                        v-model="signupEmail"
                        @keyup.enter="redirectToRegister()">
                    <div class="input-group-append">
                            <button
                                class="btn btn-custom  btn-lrg-screen"
                                @click="redirectToRegister()" 
                                type="button">
                                    Get Started >
                            </button>
                    </div>
                    <div style="margin: auto;">
                        <button
                            class="btn btn-custom btn-sml-screen"
                            @click="redirectToRegister()" 
                            type="button">
                                Get Started >
                        </button>
                    </div>
                </div>
            </div>
            <div class="guest-entry">
                <router-link :to="{ path: '/games' }">
                    Continue as a guest >
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'vcg-intro',
        data () {
            return {
                signupEmail: ""
            }
        },
        methods: {
            redirectToRegister(){
                this.$router.push({ 
                    path: '/login',
                    query: {
                        'createNew': 'true',
                        'email': this.signupEmail
                    }
                });
            },
        }
    }

</script>

<style>

    .intro {
        text-align: center;
        padding: 70px 45px;
        border-bottom: 8px solid #222;
        max-width: 100vw;
        margin: auto;
    }

    .intro-header {
        max-width: 1024px;
        font-weight: bold;
        text-shadow: 2px 2px black;
        font-size: 4rem;
    }

    .intro-sub-header {
        margin: 1rem auto;
        text-shadow: 2px 2px black;
    }

    .intro-form-text {
        font-size: 1.2rem;
        text-shadow: 2px 2px black;
    }

    .intro-text {
        max-width: 800px;
        padding: 2rem 0;
    }

    .sign-up {
        padding-top: 1rem;
    }

    .sign-up-email {
        padding-top: 1rem;
        max-width: 640px;
        margin: auto;
    }

    .sign-up-email-input {
        height:  70px;
        font-size: 1.3rem;
    }

    .guest-entry {
        padding: 1em;
        font-size: 1.2rem;
    }

    .btn-sml-screen {
        display: none;
    }

    .btn-lrg-screen {
        display: inline-block;
    }

    @media only screen 
    and (max-device-height : 680px) {

        .intro {
            padding-top: 1rem;
        }

        .intro-text {
            padding: 1rem;
        }
    }

    @media only screen 
    and (max-device-width : 800px) {
        .intro-header {
            font-size: 3rem;
        }

        .intro-sub-header {
            font-size: 2rem;
        }
    }

    @media only screen 
    and (max-device-width : 500px) {
        .intro {
            padding: 0px 45px;
        }

        .intro-header {
            font-size: 2rem;
        }

        .intro-sub-header {
            font-size: 1.5rem;
        }

        .intro-form-text {
            font-size: 1rem;
        }

        .sign-up-email-input {
            height:  50px;
            font-size: 1rem;
            width: 100% !important;
        }

        .btn-sml-screen {
            display: inline-block;
            margin-top: 0.5rem;
            font-size: 18px;
            line-height: 24px;
            padding: 0.8rem;
        }

        .btn-lrg-screen {
            display: none;
        }
    }

</style>
