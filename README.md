# vue-policy

## Project setup
Make sure to delete package-lock.json if switching between nw and non nw
update Login.vue redirectUri if necessary. Currently localhost is the correct approach due to fastapi server still being stuck on http
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
CI/CD is using github actions for cloud deployment
Push to main automatically updates
