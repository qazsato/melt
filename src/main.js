import Vue from 'vue';
import router from './router/index';
import store from './store/index';
import Element from 'element-ui';
import locale from 'element-ui/lib/locale/lang/ja';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/styles/main.css';
import './assets/fonts/icomoon/style.css';

Vue.use(Element, {locale});

new Vue({router, store}).$mount('#app');
