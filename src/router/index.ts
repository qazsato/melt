import Vue from 'vue'
import VueRouter from 'vue-router'
import MeltMain from '../components/melt-main.vue'

Vue.use(VueRouter)

const routes = [{ path: '/', component: MeltMain }]

export default new VueRouter({
  routes,
})
