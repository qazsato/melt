<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ja'
import '@/assets/styles/element-variables.scss'
import '@/assets/styles/main.scss'
Vue.use(Element, { locale })
export default Vue.extend({})
</script>
