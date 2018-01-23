import Vue from 'vue';
import VueRouter from 'vue-router';
import PageTop from '../components/PageTop.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: PageTop }
];

export default new VueRouter({
  routes
});
