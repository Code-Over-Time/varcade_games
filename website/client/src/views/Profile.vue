<template>

    <div>
       <wp-top-bar/> 
        
        <div class="row profile-settings">
            
            <div class="col-3 settings-container settings-menu">
                <h5>Profile Information</h5>
                <h5>Security</h5>
            </div>

            <div class="col-9 settings-container settings-display">

                <h4>Profile Information</h4>
                <hr>

                <h5>Display name</h5>
                <p>{{ username  }}</p>

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
            }
        },
        computed: {
            username () {
                return "my user name"
            }
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
