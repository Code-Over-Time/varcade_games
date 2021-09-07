<template>

    <div class="index-screen-image">
        <wp-top-bar v-bind:display-logout-option="false"/>
        <div class="login-box-container">
            <wp-login-register/>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'game_index',
        data () {
            return {
            }
        },
        methods: {

        },
        computed: {
          
        },
        mounted: function () {
        },
        created: function () {
        }
    }

</script>

<style scoped>
    
    .index-screen-image {
        position: absolute;
        width: 100%;
        height: 100%;
        background: url(../assets/images/bg.jpg) no-repeat center center fixed;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
    }

    .login-box-container {
        display: flex;
        align-items: center;
        margin-left: 10%;
        height: 80%;
    }

</style>
