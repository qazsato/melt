<template>
  <main>
    <toolbar />
    <section class="note">
      <editor @changeText="changeText" />
      <preview :text="text" />
    </section>
    <file-name-dialog />
    <file-data-dialog />
  </main>
</template>

<script>
import { ipcRenderer, remote } from 'electron'
import { FindInPage } from 'electron-find'
import toolbar from './Toolbar.vue'
import editor from './Editor.vue'
import preview from './Preview.vue'
import fileNameDialog from './FileNameDialog.vue'
import fileDataDialog from './FileDataDialog.vue'

export default {
  components: {
    toolbar,
    editor,
    preview,
    fileNameDialog,
    fileDataDialog
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

    ipcRenderer.on('new-post', () => {
      this.$store.commit('createNewPost')
    })

    ipcRenderer.on('open-file', () => {
      this.$store.commit('showFileNameSearch')
    })

    ipcRenderer.on('search-text', () => {
      this.findInPage.openFindWindow()
    })

    ipcRenderer.on('find-text-in-folder', () => {
      this.$store.commit('showFileDataSearch')
    })

    ipcRenderer.on('toggle-view-mode', () => {
      this.$store.commit('toggleViewMode')
    })
  },

  methods: {
    changeText (text) {
      this.text = text
      this.$store.commit('updateIsUnsaved')
    }
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
