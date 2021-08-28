import Vue from 'vue'
import router from './router'
import store from './store'
import App from './app.vue'

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
