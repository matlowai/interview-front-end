<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/new">Add Policyholder</router-link> |
    <router-link to="/claims">View Claim Notes</router-link> |
    <router-link to="/claims/new">Upload Claim Note</router-link> |
    <router-link to="/claims/gen">Generate Claim Notes</router-link> |
    <router-link to="/analysis">Analysis</router-link>
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
