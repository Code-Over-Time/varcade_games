<template>

    <div>
       <wp-top-bar :fullScreenHeader="true"/> 
        
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
                <h5>Country</h5>
                <country-select v-model="country" :country="country" topCountry="IE" />
                <hr>
                <div>
                    <button type="button"  
                        class="btn btn-custom" 
                        @click="saveProfile"
                        title="Save changes to your profile">
                            Save Changes
                    </button>
                </div>
            </div>

        </div>

       <wp-footer/>
    </div>

</template>

<script>

    import axios from 'axios'
    
    export default {
        name: 'profile',
        data () {
            return {
                country: this.$store.getters.userProfile.location

            }
        },
        computed: {
            username () {
                return "my user name"
            }
        },
        methods: {
            saveProfile () {
                const profileUrl = this.$store.state.serverUrl + '/profile_service/v1/profile/'
                console.log('Loading user profile...')
                axios.put(profileUrl, {location: this.country}).then(resp => {
                    this.$store.commit('setUserProfile', resp.data)
                    console.log('Update user profile.')
                })
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
