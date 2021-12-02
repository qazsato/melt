import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '@/pages/main.vue'
import Setting from '@/pages/setting.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Main },
  { path: '/setting', component: Setting },
]

export default new VueRouter({
  routes,
})
