<template>
  <div id="app" :class="theme">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ipcRenderer } from 'electron'
import { PAGE } from '@/constants'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ja'
import '@/assets/styles/element-variables.scss'
import '@/assets/styles/main.scss'
Vue.use(Element, { locale })

export default Vue.extend({
  computed: {
    theme() {
      return this.$store.state.preference.theme
    },

    isChanged() {
      return this.$store.state.note.isChanged
    },
  },

  watch: {
    isChanged(value) {
      ipcRenderer.invoke('is-note-changed', value)
    },
  },

  mounted() {
    ipcRenderer.on('show-setting', () => {
      if (this.$route.name === PAGE.PREFERENCE) {
        return
      }
      this.$router.push({ name: PAGE.PREFERENCE })
    })

    ipcRenderer.on('new-note', () => {
      this.$store.commit('createNewNote')
    })

    ipcRenderer.on('open-note', () => {
      this.$store.commit('showFindTitleDialog')
    })

    ipcRenderer.on('find-paragraph', () => {
      this.$store.commit('showFindParagraphDialog')
    })

    ipcRenderer.on('find-text', () => {
      this.$store.commit('showFindTextDialog')
    })

    ipcRenderer.on('find-text-in-folder', () => {
      this.$store.commit('showFindContentDialog')
    })

    ipcRenderer.on('toggle-view-mode', () => {
      this.$store.commit('toggleViewMode')
    })
  },
})
</script>

<style lang="scss" scoped>
#app {
  &.melt-light {
    color-scheme: light;
    background: $light-bg-color;
  }

  &.melt-dark {
    color-scheme: dark;
    background: $dark-bg-color;
  }
}
</style>
