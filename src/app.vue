<template>
  <div id="app" :class="theme">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ipcRenderer, remote } from 'electron'
import { FindInPage } from 'electron-find'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ja'
import '@/assets/styles/element-variables.scss'
import '@/assets/styles/main.scss'
Vue.use(Element, { locale })

interface DataType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findInPage: any
}

export default Vue.extend({
  data() {
    const data: DataType = {
      findInPage: null,
    }
    return data
  },

  computed: {
    theme() {
      return this.$store.state.theme
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
    this.findInPage = new FindInPage(remote.getCurrentWebContents(), {
      offsetTop: 8,
      boxBgColor: '#4a4a4a',
      boxShadowColor: '#4a4a4a',
      inputColor: '#aaa',
      inputBgColor: '#222',
      inputFocusColor: '#00b1b3',
      textColor: '#aaa',
      textHoverBgColor: '#555',
      caseSelectedColor: '#555',
    })

    ipcRenderer.on('show-setting', () => {
      console.log('setting!')
      this.$router.push({ path: '/setting' })
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
      this.findInPage?.openFindWindow()
    })

    ipcRenderer.on('find-text-in-folder', () => {
      this.$store.commit('showFindContentDialog')
    })

    ipcRenderer.on('toggle-view-mode', () => {
      this.$store.commit('toggleViewMode')
    })

    ipcRenderer.on('change-theme', (event, theme: string) => {
      this.$store.commit('changeTheme', theme)
    })
  },
})
</script>

<style lang="scss" scoped>
#app {
  &.melt-light {
    background: #fff;
  }

  &.melt-dark {
    background: #22272e;
  }
}
</style>
