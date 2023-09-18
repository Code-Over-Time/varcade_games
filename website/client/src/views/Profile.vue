<template>

    <div>
       <wp-top-bar :fullScreenHeader="true"/> 
        
        <div class="row profile-settings">
            
            <div class="col-3 settings-container settings-menu">
                <a href="#"><h5>Profile Information</h5></a>
                <a href="#"><h5>Security</h5></a>
            </div>

            <div class="col-9 settings-container settings-display">
                <wp-user-info v-if="currentPanel === 'userInfo'"></wp-user-info>
                <wp-security v-if="currentPanel === 'security'"></wp-security>
            </div>

        </div>

       <wp-footer/>
    </div>

</template>

<script>

    export default {
        name: 'profile',
        data () {
            return {
                currentPanel: "security"
            }
        },
        computed: {
        },
        methods: {
        }   
    }

</script>

<style scoped>

.profile-settings {
    text-align: center;
    width: 50%;
    margin: 2em auto 1em auto;
    min-height: 80vh;
}

.settings-container {
    padding: 1em;
    text-align: left;
}

.settings-menu {
}

.settings-display {
    padding-left: 2em;
}

</style>
