# vue-policy

## Project setup
Make sure to delete package-lock.json if switching between nw and non nw

update Login.vue redirectUri if necessary. Currently localhost is the correct approach due to fastapi server still being stuck on http
I have both localhost and cloud paths for back end with commenting out the unused one.  This implementation will work with a localhost fastapi setup
CI/CD is using github actions for cloud deployment
Push to main automatically updates


```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
