<template>
  <main>
    <toolbar />
    <section class="note">
      <editor />
      <preview />
    </section>
    <find-title-dialog />
    <find-content-dialog />
  </main>
</template>

<script>
import { ipcRenderer, remote } from 'electron'
import { FindInPage } from 'electron-find'
import toolbar from './Toolbar.vue'
import editor from './Editor.vue'
import preview from './Preview.vue'
import findTitleDialog from './FindTitleDialog.vue'
import findContentDialog from './FindContentDialog.vue'

export default {
  components: {
    toolbar,
    editor,
    preview,
    findTitleDialog,
    findContentDialog
  },

  data () {
    return {
      text: '',
      findInPage: null
    }
  },

  mounted () {
    this.findInPage = new FindInPage(remote.getCurrentWebContents(), {
      offsetTop: 8,
      boxBgColor: '#4a4a4a',
      boxShadowColor: '#4a4a4a',
      inputColor: '#aaa',
      inputBgColor: '#222',
      inputFocusColor: '#00b1b3',
      textColor: '#aaa',
      textHoverBgColor: '#555',
      caseSelectedColor: '#555'
    })

    ipcRenderer.on('new-note', () => {
      this.$store.commit('createNewNote')
    })

    ipcRenderer.on('open-note', () => {
      this.$store.commit('showFindTitleDialog')
    })

    ipcRenderer.on('search-text', () => {
      this.findInPage.openFindWindow()
    })

    ipcRenderer.on('find-text-in-folder', () => {
      this.$store.commit('showFindContentDialog')
    })

    ipcRenderer.on('toggle-view-mode', () => {
      this.$store.commit('toggleViewMode')
    })
  }
}
</script>

<style lang="scss" scoped>
main {
  width: 100%;
  height: 100%;
}

.note {
  height: calc(100% - 50px);
  background-color: #fff;
}
</style>
