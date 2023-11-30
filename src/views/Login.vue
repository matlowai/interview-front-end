<template>
    <div class="login-container">
      <h1>Login</h1>
      <button @click="initiateLogin">Login with OAuth2 Provider</button>
    </div>
  </template>
  
  <script>
import { mapActions } from 'vuex';
import router from '../router';

export default {
    methods: {
    ...mapActions(['login']),
    initiateLogin() {
        // Construct the URL for Azure AD login
        const tenantId = '059fb2ad-7eca-495b-8b94-3440d83f2a67';
        const clientId = '8016037c-54cf-4836-a33f-dfcbc9b47d90';
        const redirectUri = encodeURIComponent('http://localhost:8080/login');
        const scope = encodeURIComponent('openid profile email');
        const responseType = 'code';

        const loginUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&scope=${scope}&response_mode=query`;

        // Redirect to the login URL
        window.location.href = loginUrl;
    },
    getAuthCodeFromRedirect() {
        // Parse the URL to get the auth code
        const queryParams = new URLSearchParams(window.location.search);
        return queryParams.get('code');
    },
  mounted() {
    const authCode = this.getAuthCodeFromRedirect();
    if (authCode) {
      console.log('Authorization Code:', authCode); // Debug log
      this.login(authCode).then(() => {
        console.log('Logged in successfully'); // Debug log
      }).catch(error => {
        console.error('Login error:', error); // Error log
      });
    } else {
        console.log('noAuthOnMount')
    }
  }
},
};
</script>

  
  <style scoped>
  .login-container {
    /* Add styles for your login page */
  }
  </style>
  