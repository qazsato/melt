<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ja'
import '@styles/element-variables.scss'
import '@styles/main.scss'
Vue.use(Element, { locale })
export default {}
</script>
