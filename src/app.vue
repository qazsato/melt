<template>
  <div id="app" :class="theme">
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
export default Vue.extend({
  computed: {
    theme() {
      return this.$store.state.theme
    },
  },
})
</script>

<style lang="scss" scoped>
#app {
  &.melt-light {
    background: #fff;
  }

  &.melt-dark {
    background: #0d1117;
  }
}
</style>
