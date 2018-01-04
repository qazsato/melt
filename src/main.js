import Vue from 'vue';
import VueRouter from 'vue-router';
import Element from 'element-ui';
import locale from 'element-ui/lib/locale/lang/ja';
import 'element-ui/lib/theme-chalk/index.css';
import AppTop from './components/AppTop.vue';
import './styles/main.css';
import './fonts/icomoon/style.css';


Vue.use(VueRouter);
Vue.use(Element, {locale});

const router = new VueRouter({
  routes: [
    { path: '/', component: AppTop }
  ]
});
new Vue({router}).$mount('#app');
