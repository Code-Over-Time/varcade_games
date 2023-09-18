<template>
    <div>
        <h4>Profile Information</h4>
        <hr>
        <h5>Display name</h5>
        <p>{{ username  }}</p>
        <h5>Country</h5>
        <country-select v-model="country" :country="country" topCountry="IE">
        </country-select>
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
</template>

<script>

    import axios from 'axios'
    
    export default {
        name: 'profile-user-info',
        data () {
            return {
                country: this.$store.getters.userProfile.location,
                username: this.$store.getters.userProfile.user.username
            }
        },
        computed: {
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


</style>
