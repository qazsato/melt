<template>
  <div class="app" :class="theme">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ipcRenderer } from 'electron'
import { PAGE } from '@/constants'

export default defineComponent({
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
.app {
  height: 100%;
  &.melt-light {
    color-scheme: light;
    background: var.$light-bg-color;
  }

  &.melt-dark {
    color-scheme: dark;
    background: var.$dark-bg-color;
  }
}
</style>
