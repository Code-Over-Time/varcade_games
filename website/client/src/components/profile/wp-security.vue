<template>
    <div>
        <h4>Account Security</h4>
        <hr>
        <h5>Change Password</h5>
        <label for="oldpass" class="input-label">Old Password</label>
        <input  type="password" class="input form-control" id="oldpass" 
        v-model="oldPassword" @keyup.enter="changePassword">
       
        <label for="newpass1" class="input-label">New Password</label>
        <input  type="password" class="input form-control" id="newpass1" 
        v-model="newPassword1" @keyup.enter="changePassword">
        
        <label for="newpass2" class="input-label">Repeat New Password</label>
        <input  type="password" class="input form-control" id="newpass2" 
        v-model="newPassword1" @keyup.enter="changePassword">       
        <hr>
        <div>
            <button type="button"  
                class="btn btn-custom" 
                @click="savePassword"
                title="Save changes to your profile">
                Change Password
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
                oldPassword: "",
                newPassword1: "",
                newPassword2: ""
            }
        },
        computed: {
        },
        methods: {
            savePassword () {
                if (this.newPassword1 === "" || this.newPassword2 === "") {
                    console.log("Empty password fields...")
                    return
                }
                if (this.newPassword1 !== this.newPassword2) {
                    console.log("New passwords do not match")
                    return
                }
                const changePassUrl = this.$store.state.serverUrl + '/account_service/v1/change_password/'
                console.log('Changing password...')
                axios.put(changePassUrl, {
                    currentPassword: this.oldPassword,
                    newPassword: this.newPassword1
                }
                ).then(resp => {
                    this.$store.commit('setUserProfile', resp.data)
                    console.log('Update user profile.')
                })
            }
        }   
    }

</script>

<style scoped>


<
