<template>
  <div
    v-show="isViewModeEditor"
    class="editor-area"
  >
    <textarea id="editor" />
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import Editor from '@scripts/editor/markdown-editor.js'
import { VIEW_MODE } from '@constants/index.js'

export default {
  data () {
    return {
      editor: null
    }
  },

  computed: {
    isViewModeEditor () {
      return this.$store.state.viewMode === VIEW_MODE.EDITOR
    },

    viewMode () {
      return this.$store.state.viewMode
    },

    note () {
      return this.$store.state.note
    }
  },

  watch: {
    viewMode (value) {
      // NOTE: HTMLモードでファイル変更し、TEXTモードに切り替えた場合、変更前の情報が表示されたままとなってしまう。
      // その問題を回避するため、ここで再度テキストを設定して変更後の情報にする。
      if (value === VIEW_MODE.EDITOR) {
        // 未保存の情報を上書きしないように、保存済みの場合のみ設定する
        if (this.$store.state.note.isSaved) {
          this.$nextTick().then(() => this.editor.setText(this.$store.state.note.content))
        }
      }
    },

    note (note) {
      this.editor.setText(note.content)
    }
  },

  mounted () {
    this.editor = new Editor('editor')
    this.editor.on('change', () => {
      this.$store.commit('updateNote', this.editor.getText())
    })
    this.editor.addKeyMap({
      'Cmd-L': () => this.$store.commit('showLinkDialog'),
      'Shift-Cmd-L': () => this.$store.commit('showImageDialog'),
      'Cmd-B': () => this.editor.insertBold(),
      'Cmd-I': () => this.editor.insertItalic(),
      'Cmd-D': () => this.editor.insertStrikethrough(),
      'Cmd-K': () => this.editor.insertCode(),
      'Cmd-U': () => this.editor.insertQuote(),
      'Shift-Cmd-U': () => this.editor.insertBulletedList(),
      'Shift-Cmd-O': () => this.editor.insertNumberedList(),
      'Shift-Cmd-X': () => this.editor.insertCheckedList(),
      'Cmd-T': () => this.$store.commit('showTableDialog'),
      'Cmd-S': () => this.saveNote()
    })
    this.$store.commit('setEditor', this.editor)
  },

  methods: {
    saveNote () {
      const content = this.editor.getText()
      if (this.$store.state.note.filePath) {
        this.$store.commit('updateNote', content)
        this.$store.commit('saveNote')
      } else {
        ipcRenderer.invoke('new-note-save', content)
          .then((data) => {
            // キャンセルで閉じた
            if (data.status === undefined) {
              return
            }
            // 保存できなかった
            if (data.status === false) {
              alert(`ファイルが開けませんでした。\n${data.message}`)
              return
            }
            this.$store.commit('saveNote', data.path)
            this.$store.commit('changeNote', data.path)
          })
          .catch((err) => {
            alert(err)
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-area {
  flex: 1;
  min-width: 50%;
  height: 100%;
}

#editor {
  width: 100%;
  height: 100%;
}
</style>
