<template>

    <div class="form-box-bg">

        <div class="container">
          
          <div v-if="loginSelected">

            <div class="login-header">            
              <h4 class="login-title">Welcome Back!</h4>
              <p>Ready to play some games?</p>
            </div>
            
            <div v-if="showInvalidCredentialsError" class="login-error">
              <p>Unable to login - please check your email and password.</p>
            </div>

            <form>
              <div class="form-group">
                <label for="email" class="input-label">EMAIL</label>
                <input  type="email" class="input form-control" id="email" v-model="lemail"
                        aria-describedby="emailHelp" @keyup.enter="login">
              </div>

              <div class="form-group">
                <label for="password" class="input-label">PASSWORD</label>
                <input  type="password" class="input form-control" id="password" 
                        v-model="lpassword" @keyup.enter="login">
                <!-- <div>
                  <a href="#">Forgot your password?</a>
                </div> -->
              </div>

              <div>
                <button type="button" 
                        :disabled=!loginEnabled 
                        class="btn btn-custom btn-block" 
                        @click="login"
                        :title="loginBtnTooltip">
                      Login
                </button>
              </div>
            </form>
            <div>
              No account? <a href="#" v-on:click="selectRegister()">Register</a>
            </div>
          </div>

          <div v-else class="row">

            <div class="col">
              <div class="login-header">            
                <h4 class="login-title">Create an account</h4>
              </div>

              <div v-if="showInvalidRegistrationDataError" class="registration-error">
                <p>Unable to register.</p>
                <ul>
                  <li v-for="error in registrationFieldErrors" v-bind:key="error">
                    {{ error }}
                  </li>
                </ul>
              </div>

              <div class="form-group">
                <label for="email" class="input-label">EMAIL</label>
                <input  type="email" class="input form-control" id="email" v-model="remail"
                        aria-describedby="emailHelp" @keyup.enter="register">
                 <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>

              <div class="form-group">
                <label for="uname" class="input-label">USERNAME</label>
                <input  type="text" class="input form-control" id="uname" 
                        v-model="rusername" @keyup.enter="register">
              </div>

              <div class="form-group">
                <label for="password" class="input-label">PASSWORD</label>
                <input  type="password" class="input form-control" id="password" 
                        v-model="rpassword" @keyup.enter="register">
              </div>
              <button type="button" 
                      :disabled=!registerEnabled 
                      class="btn btn-custom btn-block" 
                      @click="register"
                      :title="registerBtnTooltip">
                Register Now
              </button>
              <div>
                Already have an account? <a href="#" v-on:click="selectLogin()">Login</a>
              </div>
            </div>
          
          </div>

        </div>
    </div>

</template>

<script>

import axios from 'axios';

import {login, register} from '../auth.js';

export default {
  name: "wp-login-register",
  props: [],
  data () {
    return {
      loginSelected: true,
      rusername: '',
      remail: '',
      rpassword: '',
      lemail: '',
      lpassword: '',
      loginEnabled: false,
      registerEnabled: false,
      showInvalidCredentialsError: false,
      showInvalidRegistrationDataError: false,
      registrationErrorMessage: '',
      registrationFieldErrors: []
    }
  },
  watch: {
    rusername: function () {
      this.checkRegisterCredentials()
    },
    remail: function () {
      this.checkRegisterCredentials()
    },
    rpassword: function () {
      this.checkRegisterCredentials()
    },
    lemail: function () {
      this.checkLoginCredentials()
    },
    lpassword: function () {
      this.checkLoginCredentials()
    }
  },
  computed: {
    loginBtnTooltip: function () {
      if (this.loginEnabled) {
        return "Login"
      }
      return "Please enter a valid Email address and password."
    },
    registerBtnTooltip: function () {
      if (this.registerEnabled) {
        return "Register Now"
      }
      return "Please enter a valid Email address, username and password."
    }
  },
  methods: {

    selectRegister: function() {
      this.loginSelected = false;
    },

    selectLogin: function() {
      this.loginSelected = true;
    },

    checkLoginCredentials: function() {
      this.loginEnabled = this.lemail != null && 
                          this.lemail !== '' && 
                          this.lpassword != null && 
                          this.lpassword !== '' &&
                          this.validateEmail(this.lemail); 
      return this.loginEnabled;
    },

    checkRegisterCredentials: function() {
      this.registerEnabled =  this.remail != null && 
                              this.remail !== '' && 
                              this.rpassword != null && 
                              this.rpassword !== '' &&
                              this.rusername != null && 
                              this.rusername !== '' &&
                              this.validateEmail(this.remail); 
      return this.registerEnabled;
    },

    validateEmail: function (mail) {
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
        return (true)
      }
      return false
    },

    login: function() {
      this.showInvalidCredentialsError = false
      login(this.$store, this.lemail, this.lpassword, () => {
        this.fetchUserProfile();
      }, () => {
        this.showInvalidCredentialsError = true
      })
    },

    register: function() {
      register(this.$store, this.remail, this.rusername, this.rpassword, () => {  // On success
          this.fetchUserProfile();
        }, (status, errorData) => { //onError
          if (status === 400 && errorData) {
            this.registrationFieldErrors = []
            for (const error in errorData) {
              this.registrationFieldErrors.push(`${errorData[error]}`)
            }
          }
          this.showInvalidRegistrationDataError = true
        }
      )
    },

    fetchUserProfile: function() {
      const profileUrl = this.$store.state.serverUrl + '/profile_service/v1/profile/';
      console.log('Loading user profile...');
      axios.get(profileUrl).then(resp => {
        this.$store.commit('setUserProfile', resp.data);
        console.log('Got user info, login complete.');
        this.$router.push({ name: 'Games' })
      });
    }

  }
}

</script>

<style scoped>

  a {
    color: #ff4848;
  }

  p.error {
    font-weight: bold;
  }

  .container {
    padding: 1em;
    line-height: 20px;
    color: #c9c9c9;
  }

  .input {
    background: #575757bd;
    border-color: transparent;
    color: white;
    margin-bottom: 8px;
  }

  .input-label {
    font-size: 14px;
    line-height: 16px;
  }

  .btn-custom {
    color: #fff;
    font-size: 16px;
    line-height: 24px;
    background-color: #ff4848;
    margin-top: 2em;
    margin-bottom: 8px;
  }

  .btn-custom:focus {
    border-color: #ff4848;
    box-shadow: 0 0 15px red;
  }

  .btn-custom:disabled,
  .btn-custom[disabled]{
    border: 1px solid #999999;
    background-color: #cccccc;
    color: #666666;
  }

  .input:focus {
    box-shadow: 0 0 5px red;
  }

  .login-header {
    text-align: center;
  }

  .login-error {
    display: flex;
    justify-content: center;
    color: white;
    border: 1px solid red;
    padding-top: 1rem;
    margin-bottom: 0.5em;
    background: #ff484840;
  }

  .registration-error {
    color: white;
    border: 1px solid red;
    padding-top: 1rem;
    padding-left:  1rem;
    margin-bottom: 0.5em;
    background: #ff484840;
  }

  .login-title {
    color: white;
  }

  .auth-option {
    padding-right: 2em;
  }

  .border-right {
    border-right: solid;
  }
  
  .form-entry {
    padding: 1em;
  }

  .form-box-bg {
    background: #343a40;
    border-radius: 5px;
    padding: 1em;
    max-width: 30em;
    width: 100%;
  }


</style>
