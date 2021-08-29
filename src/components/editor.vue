<template>
  <div v-show="isViewModeEditor" class="editor-area">
    <textarea id="editor" />
  </div>
</template>

<script>
import setting from '@config/setting.json'
import axios from 'axios'
import { ipcRenderer } from 'electron'
import Editor from '@/assets/scripts/editor/markdown-editor'
import { VIEW_MODE, ALLOW_DROP_FILE_TYPES } from '@/constants'
import { isCodeBlock, getDefaultCodeBlock } from '@/utils/markdown'
import 'codemirror/lib/codemirror.css'
import '@/assets/styles/melt-light.scss'

export default {
  data() {
    return {
      editor: null,
      isPasteAsPlainText: false,
    }
  },

  computed: {
    isViewModeEditor() {
      return this.$store.state.viewMode === VIEW_MODE.EDITOR
    },

    viewMode() {
      return this.$store.state.viewMode
    },

    note() {
      return this.$store.state.note
    },
  },

  watch: {
    viewMode(value) {
      // NOTE: HTMLモードでファイル変更し、TEXTモードに切り替えた場合、変更前の情報が表示されたままとなってしまう。
      // その問題を回避するため、ここで再度テキストを設定して変更後の情報にする。
      if (value === VIEW_MODE.EDITOR) {
        // 変更済みの情報を上書きしないように、未変更の場合のみ設定する
        if (!this.$store.state.note.isChanged) {
          this.$nextTick().then(() =>
            this.editor.setText(this.$store.state.note.content)
          )
        }
      }
    },

    note(note) {
      this.editor.setText(note.content)
    },
  },

  mounted() {
    this.editor = new Editor('editor')
    this.editor.on('change', this.onChangeText)
    this.editor.on('paste', this.onPasteText)
    this.editor.on('drop', this.onDropFile)
    this.editor.addKeyMap({
      'Cmd-L': () => this.$store.commit('showLinkDialog'),
      'Shift-Cmd-L': () => this.$store.commit('showImageDialog'),
      'Cmd-B': () => this.editor.insertBold(),
      'Cmd-I': () => this.editor.insertItalic(),
      'Cmd-D': () => this.editor.insertStrikethrough(),
      'Cmd-K': () => this.editor.insertCode(),
      'Cmd-U': () => this.editor.insertQuote(),
      'Shift-Cmd-U': () => this.editor.insertBulletList(),
      'Shift-Cmd-O': () => this.editor.insertOrderedList(),
      'Shift-Cmd-X': () => this.editor.insertTaskList(),
      'Cmd-T': () => this.$store.commit('showTableDialog'),
      'Cmd-S': () => this.saveNote(),
      'Shift-Cmd-V': () => this.pasteAsPlainText(),
    })
    this.$store.commit('setEditor', this.editor)
  },

  methods: {
    saveNote() {
      const content = this.editor.getText()
      if (this.$store.state.note.filePath) {
        this.$store.commit('updateNote', content)
        this.$store.commit('saveNote')
      } else {
        ipcRenderer
          .invoke('new-note-save', content)
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
    },

    onChangeText(editor, event) {
      if (this.isInsertCodeBlock(event)) {
        const currentLine = editor.getCursor().line
        this.editor.selectLine(currentLine)
        this.editor.insertText(getDefaultCodeBlock())
        this.editor.gotoLine(currentLine + 1)
      }
      this.$store.commit('updateNote', this.editor.getText())
    },

    onPasteText(editor, event) {
      if (this.isPasteAsPlainText) {
        return
      }
      const text = event.clipboardData.getData('text')
      try {
        // eslint-disable-next-line no-new
        new URL(text)
      } catch (error) {
        return // URLに変換できない場合何もしない
      }
      const url = `${setting.api}/sites/metadata?url=${text}`
      axios
        .get(url)
        .then((res) => {
          if (res.data.title) {
            this.editor.insertLink(res.data.title, text)
          } else {
            this.editor.insertText(text)
          }
        })
        .catch(() => {
          this.editor.insertText(text)
        })
      event.preventDefault()
    },

    onDropFile(editor, event) {
      const files = event.dataTransfer.files
      if (files.length > 1) {
        return
      }
      const file = files[0]
      if (!ALLOW_DROP_FILE_TYPES.includes(file.type)) {
        return
      }
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        const data = {
          key: file.name,
          type: file.type,
          attachment: e.target.result,
        }
        axios.post(`${setting.api}/images`, data).then((res) => {
          this.editor.insertImage(res.data.name, res.data.url, true)
        })
      }
    },

    pasteAsPlainText() {
      this.isPasteAsPlainText = true
      document.execCommand('paste')
      this.isPasteAsPlainText = false
    },

    isInsertCodeBlock(event) {
      if (event.from.line === event.to.line) {
        const text = this.editor.getLineText(event.to.line)
        const removed = event.removed[0]
        if (isCodeBlock(text) && !isCodeBlock(removed)) {
          return true
        }
      }
      return false
    },
  },
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
