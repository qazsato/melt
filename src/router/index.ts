import Vue from 'vue'
import VueRouter from 'vue-router'
import { PAGE } from '@/constants'
import Main from '@/pages/main.vue'
import Preference from '@/pages/preference.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: PAGE.MAIN, component: Main },
  { path: '/preference', name: PAGE.PREFERENCE, component: Preference },
]

export default new VueRouter({
  routes,
})
