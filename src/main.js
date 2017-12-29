import Vue from 'vue';
import VueRouter from 'vue-router';
import AppTop from './components/AppTop.vue';
import ace from 'ace-builds/src-min-noconflict/ace';
import 'ace-builds/src-min-noconflict/theme-monokai';
import 'ace-builds/src-min-noconflict/mode-markdown';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: '/', component: AppTop }
  ]
});
new Vue({router}).$mount('#app');
