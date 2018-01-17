import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Element from 'element-ui';
import locale from 'element-ui/lib/locale/lang/ja';
import 'element-ui/lib/theme-chalk/index.css';
import AppTop from './components/AppTop.vue';
import './styles/main.css';
import './fonts/icomoon/style.css';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Element, {locale});

const store = new Vuex.Store({
  state: {
    mode: 'multi',
    editor: null,
    linkDialogVisible: false,
    imageDialogVisible: false,
    tableDialogVisible: false
  },
  mutations: {
    changeMode(state, mode) {
      state.mode = mode;
    },
    setEditor(state, editor) {
      state.editor = editor;
    },
    visualizeLinkDialog(state, visible) {
      state.linkDialogVisible = visible;
    },
    visualizeImageDialog(state, visible) {
      state.imageDialogVisible = visible;
    },
    visualizeTableDialog(state, visible) {
      state.tableDialogVisible = visible;
    }
  }
});

const router = new VueRouter({
  routes: [
    { path: '/', component: AppTop }
  ]
});

new Vue({store, router}).$mount('#app');
