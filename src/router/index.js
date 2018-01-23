import Vue from 'vue';
import VueRouter from 'vue-router';
import AppTop from '../components/AppTop.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: AppTop }
];

export default new VueRouter({
  routes
});
