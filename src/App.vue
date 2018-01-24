<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue';
import Element from 'element-ui';
import locale from 'element-ui/lib/locale/lang/ja';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/styles/main.css';
import './assets/fonts/icomoon/style.css';
Vue.use(Element, {locale});
export default {}
</script>
