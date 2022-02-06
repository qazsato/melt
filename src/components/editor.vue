<template>
  <div v-show="isViewModeEditor" class="editor-area">
    <textarea id="editor" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import setting from '@/config/setting'
import axios from 'axios'
import { ipcRenderer } from 'electron'
import { Editor as CM } from 'codemirror'
import Editor from '@/assets/scripts/editor/markdown-editor'
import { VIEW_MODE, ALLOW_DROP_FILE_TYPES } from '@/constants'
import { isCodeBlock, getDefaultCodeBlock } from '@/utils/markdown'
import 'codemirror/lib/codemirror.css'
import '@/assets/styles/editor/markdown.scss'

interface DataType {
  editor: Editor | null
  isPasteAsPlainText: boolean
}

export default Vue.extend({
  data() {
    const data: DataType = {
      editor: null,
      isPasteAsPlainText: false,
    }
    return data
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
          this.$nextTick().then(() => this.editor?.setText(this.$store.state.note.content))
        }
      }
    },

    note(note) {
      this.editor?.setText(note.content)
    },
  },

  mounted() {
    this.editor = new Editor('editor', this.$store.state.preference.theme)
    this.setStyle()
    this.editor.on('change', this.onChangeText)
    this.editor.on('paste', this.onPasteText)
    this.editor.on('drop', this.onDropFile)
    this.editor.addKeyMap({
      'Cmd-L': () => this.$store.commit('showLinkDialog'),
      'Shift-Cmd-L': () => this.$store.commit('showImageDialog'),
      'Cmd-B': () => this.editor?.insertBold(),
      'Cmd-I': () => this.editor?.insertItalic(),
      'Cmd-D': () => this.editor?.insertStrikethrough(),
      'Cmd-K': () => this.editor?.insertCode(),
      'Cmd-U': () => this.editor?.insertQuote(),
      'Shift-Cmd-U': () => this.editor?.insertBulletList(),
      'Shift-Cmd-O': () => this.editor?.insertOrderedList(),
      'Shift-Cmd-X': () => this.editor?.insertTaskList(),
      'Cmd-T': () => this.$store.commit('showTableDialog'),
      'Cmd-S': () => this.saveNote(),
      'Shift-Cmd-V': () => this.pasteAsPlainText(),
      'Alt-Up': () => this.swapAboveLine(),
      'Alt-Down': () => this.swapBelowLine(),
      'Ctrl-A': () => this.goLineStart(),
    })
    this.$store.commit('setEditor', this.editor)
    this.$nextTick().then(() => this.editor?.setText(this.$store.state.note.content))
  },

  methods: {
    setStyle() {
      const cm = document.querySelector('.CodeMirror') as HTMLElement
      const ff = this.$store.state.preference.fontFamily
      const fs = `${this.$store.state.preference.fontSize}px`
      cm.setAttribute('style', `font-family: ${ff}; font-size:${fs};`)
    },

    saveNote() {
      this.editor?.optimizeText()
      const content = this.editor?.getText()
      if (this.$store.state.note.filePath) {
        this.$store.commit('updateNote', content)
        this.$store.commit('saveNote')
      } else {
        ipcRenderer
          .invoke('new-note-save', content, this.$store.state.preference.directory)
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChangeText(editor: CM, event: any) {
      if (this.isInsertCodeBlock(event)) {
        const currentLine = editor.getCursor().line
        this.editor?.selectLine(currentLine)
        this.editor?.insertText(getDefaultCodeBlock())
        this.editor?.gotoLine(currentLine + 1)
      }
      this.$store.commit('updateNote', this.editor?.getText())
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onPasteText(editor: CM, event: any) {
      if (this.isPasteAsPlainText) {
        return
      }
      const text = event.clipboardData.getData('text')
      try {
        const url = new URL(text)
        if (url.protocol !== 'https:') {
          return // HTTPでない場合何もしない
        }
      } catch (error) {
        return // URLに変換できない場合何もしない
      }
      const url = `${setting.api}/sites/metadata?url=${text}`
      axios
        .get(url)
        .then((res) => {
          if (res.data.title) {
            this.editor?.insertLink(res.data.title, text)
          } else {
            this.editor?.insertText(text)
          }
        })
        .catch(() => {
          this.editor?.insertText(text)
        })
      event.preventDefault()
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onDropFile(editor: CM, event: any) {
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
          attachment: e.target?.result,
        }
        axios.post(`${setting.api}/images`, data).then((res) => {
          this.editor?.insertImage(res.data.name, res.data.url, true)
        })
      }
    },

    pasteAsPlainText() {
      this.isPasteAsPlainText = true
      document.execCommand('paste')
      this.isPasteAsPlainText = false
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isInsertCodeBlock(event: any) {
      // ペーストや復元の場合対象外
      if (event.origin === undefined || event.origin === 'paste' || event.origin === 'undo') {
        return false
      }
      // 入力文字が改行やBSの場合対象外
      if (event.text[0] === '') {
        return false
      }
      // 入力文字が複数行にまたがっている場合対象外
      if (event.from.line !== event.to.line) {
        return false
      }
      const text = this.editor?.getLineText(event.to.line) || ''
      const removed = event.removed[0]
      if (isCodeBlock(text) && !isCodeBlock(removed)) {
        return true
      }
      return false
    },

    swapAboveLine() {
      this.editor?.swapAboveLine()
    },

    swapBelowLine() {
      this.editor?.swapBelowLine()
    },

    goLineStart() {
      this.editor?.goLineStart()
    },
  },
})
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
