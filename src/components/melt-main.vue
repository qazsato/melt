<template>
  <div class="melt">
    <header>
      <tool-bar />
    </header>
    <main>
      <editor />
      <preview />
    </main>
    <footer>
      <status-bar />
    </footer>
    <div>
      <find-paragraph-dialog />
      <find-title-dialog />
      <find-content-dialog />
      <image-dialog />
      <link-dialog />
      <table-dialog />
    </div>
  </div>
</template>

<script>
import { ipcRenderer, remote } from 'electron'
import { FindInPage } from 'electron-find'
import toolBar from './tool-bar.vue'
import editor from './editor.vue'
import preview from './preview.vue'
import statusBar from './status-bar.vue'
import findParagraphDialog from './dialog/find-paragraph-dialog.vue'
import findTitleDialog from './dialog/find-title-dialog.vue'
import findContentDialog from './dialog/find-content-dialog.vue'
import imageDialog from './dialog/image-dialog.vue'
import linkDialog from './dialog/link-dialog.vue'
import tableDialog from './dialog/table-dialog.vue'

export default {
  components: {
    toolBar,
    editor,
    preview,
    statusBar,
    findParagraphDialog,
    findTitleDialog,
    findContentDialog,
    imageDialog,
    linkDialog,
    tableDialog
  },

  data () {
    return {
      findInPage: null
    }
  },

  computed: {
    isSaved () {
      return this.$store.state.note.isSaved
    }
  },

  watch: {
    isSaved (value) {
      ipcRenderer.invoke('is-note-saved', value)
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

    ipcRenderer.on('find-paragraph', () => {
      this.$store.commit('showFindParagraphDialog')
    })

    ipcRenderer.on('find-text', () => {
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
.melt {
  width: 100%;
  height: 100%;
}

header {
  height: 50px;
}

main {
  height: calc(100% - 70px);
  background-color: #fff;
}

footer {
  height: 20px;
}
</style>
