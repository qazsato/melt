import Vue from 'vue'
import router from './router/index'
import store from './store/index'
import App from './App.vue'

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
