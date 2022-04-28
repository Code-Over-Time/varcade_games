<template>
    <div>
        <div class="index-screen-image" :style="headerImageHeightCSS"></div>
        <wp-top-bar/>
        <div>
            <wp-vcg-intro ref="headerContent"></wp-vcg-intro>
            <wp-homepage-pitch></wp-homepage-pitch>
            <wp-faq></wp-faq>
        </div>
        <wp-footer/>
    </div>
</template>

<script>

    export default {
        name: 'game_index',
        data () {
            return {
                signupEmail: '',
                headerImageHeightCSS: 'height: 100vh'
            }
        },
        methods: {
            redirectToLogin () {
                this.$router.push({ 
                    path: '/login',
                    query: {
                        'createNew': 'false',
                        'email': ''
                    }
                });
            },
            sizeHeaderImage () {
                if (this.$refs.headerContent) {
                    let totalHeight = this.$refs.headerContent.$el.offsetHeight + 
                        this.$refs.headerContent.$el.offsetTop;
                    this.headerImageHeightCSS = `height: ${totalHeight}px`;
                }
                else {
                    this.headerImageHeightCSS = 'height: 100vh';
                }
            }
        },
        mounted() {
           this.$nextTick(() => {
              window.addEventListener('onorientationchange', this.sizeHeaderImage);
              window.addEventListener('resize', this.sizeHeaderImage);
           });
           this.sizeHeaderImage(); 
        },
        created() {
           
        }
    }

</script>

<style scoped>

    .index-screen-image {
        background: 
            linear-gradient(rgba(0, 0, 0, 0.5), 
            rgba(0, 0, 0, 0.7)),
            black url('~@/assets/images/bg.jpg');
        background-repeat: no-repeat;
        background-position: center;
        max-width: 100vw;
        position: absolute;
        z-index: -1; 
        background-size: cover;
        position: absolute;
        top: 0px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
    }

    @media only screen 
    and (max-device-height : 1168px) {
        .index-screen-image {
            top: 0px;
        }
    }

    @media (max-device-width : 1940px) {
        .header-wrapper {
            margin: 0 5%;
        }
    }

    @media (max-device-width : 800px) {
        .header-text {
            font-size: 28px;
            max-width: 10%;
        }
    }

    @media (max-device-width : 500px) {
        .btn-custom {
            font-size: 12px;
            line-height: 14px;
            padding: 0.2rem 0.5rem;
        }
    
        .header-button {
            font-size: 0.9rem;
            max-height: 1.9rem;
        }

        .header-text {
            font-size: 16px;
        }
    }

</style>
