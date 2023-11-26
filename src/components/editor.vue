<template>
  <div v-show="isViewModeEditor" class="editor-area">
    <textarea id="editor" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import setting from '@/config/setting'
import axios from 'axios'
import { ipcRenderer } from 'electron'
import { Editor as CM } from 'codemirror'
import MarkdownEditor from '@/assets/scripts/editor/markdown-editor'
import { VIEW_MODE, ALLOW_DROP_FILE_TYPES } from '@/constants'
import { isCodeBlock, getDefaultCodeBlock, isTableRow } from '@/utils/markdown'
import 'codemirror/lib/codemirror.css'
import '@/assets/styles/editor/markdown.scss'
const API_KEY = process.env.VUE_APP_MELT_API_KEY

// cf. https://github.com/codemirror/CodeMirror/issues/6805
let editor: MarkdownEditor | null

interface DataType {
  isPasteAsPlainText: boolean
}

export default defineComponent({
  name: 'MeltEditor',
  props: {
    insertImage: {
      type: Object,
      default: null,
    },

    insertLink: {
      type: Object,
      default: null,
    },

    insertTable: {
      type: Object,
      default: null,
    },
  },

  data() {
    const data: DataType = {
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
          setTimeout(() => editor?.setText(this.$store.state.note.content))
        }
        setTimeout(() => editor?.focus())
      }
    },

    note(note) {
      editor?.setText(note.content)
      editor?.focus()
    },

    insertImage(value) {
      editor?.insertImage(value.imageAlt, value.imageUrl)
      editor?.focus()
    },

    insertLink(value) {
      editor?.insertLink(value.linkTitle, value.linkUrl)
      editor?.focus()
    },

    insertTable(value) {
      editor?.insertTable(value.tableRow, value.tableColumn)
      editor?.focus()
    },
  },

  mounted() {
    const option = {
      theme: this.$store.state.preference.theme,
      lineWrapping: this.$store.state.preference.wordWrap,
      lineNumbers: this.$store.state.preference.lineNumber,
    }
    editor = new MarkdownEditor('editor', option)
    this.setStyle()
    editor.on('change', this.onChangeText)
    editor.on('paste', this.onPasteText)
    editor.on('drop', this.onDropFile)
    editor.addKeyMap({
      'Cmd-F': () => editor?.openSearchDialog(),
      'Cmd-L': () => this.$store.commit('showLinkDialog'),
      'Shift-Cmd-L': () => this.$store.commit('showImageDialog'),
      'Cmd-B': () => editor?.insertBold(),
      'Cmd-I': () => editor?.insertItalic(),
      'Cmd-D': () => editor?.insertStrikethrough(),
      'Cmd-K': () => editor?.insertCode(),
      'Cmd-U': () => editor?.insertQuote(),
      'Shift-Cmd-U': () => editor?.insertBulletList(),
      'Shift-Cmd-O': () => editor?.insertOrderedList(),
      'Shift-Cmd-X': () => editor?.insertTaskList(),
      'Cmd-T': () => this.$store.commit('showTableDialog'),
      'Cmd-S': () => this.saveNote(),
      'Shift-Cmd-V': () => this.pasteAsPlainText(),
      'Alt-Up': () => this.swapAboveLine(),
      'Alt-Down': () => this.swapBelowLine(),
      'Ctrl-A': () => this.goLineStart(),
    })
    setTimeout(() => editor?.setText(this.$store.state.note.content))
  },

  methods: {
    setStyle() {
      const cm = document.querySelector('.CodeMirror') as HTMLElement
      const ff = this.$store.state.preference.fontFamily
      const fs = `${this.$store.state.preference.fontSize}px`
      const padding = this.$store.state.preference.lineNumber ? '0 0 15px 0' : '15px'
      cm.setAttribute('style', `font-family: ${ff}; font-size:${fs}; padding: ${padding}`)
    },

    saveNote() {
      editor?.optimizeTable()
      const content = editor?.getText()
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
    onChangeText(cm: CM, event: any) {
      const pos = cm.getCursor()
      const lineText = editor?.getLineText(pos.line)
      if (lineText && isTableRow(lineText)) {
        // 英数・かな入力（スペース除く）、BS、ペースト時のみテーブル最適化
        if (
          (['+input', '*compose'].includes(event.origin) && event.text[0].trim().length > 0) ||
          ['+delete', 'paste'].includes(event.origin)
        ) {
          editor?.optimizeTable()
        }
      }
      if (this.isInsertCodeBlock(event)) {
        const currentLine = cm.getCursor().line
        editor?.selectLine(currentLine)
        editor?.insertText(getDefaultCodeBlock())
        editor?.gotoLine(currentLine + 1)
      }
      this.$store.commit('updateNote', editor?.getText())
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onPasteText(cm: CM, event: any) {
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
      const params = { url: text, api_key: API_KEY }
      axios
        .get(`${setting.api}/sites/meta`, { params })
        .then((res) => {
          if (res.data.title) {
            editor?.insertLink(res.data.title, text)
          } else {
            editor?.insertText(text)
          }
        })
        .catch(() => {
          editor?.insertText(text)
        })
      event.preventDefault()
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onDropFile(cm: CM, event: any) {
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
        axios.post(`${setting.api}/images?api_key=${API_KEY}`, data).then((res) => {
          editor?.insertImage(file.name, res.data.url, true)
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
      const text = editor?.getLineText(event.to.line) || ''
      if (!isCodeBlock(text)) {
        return false
      }
      if (text.length !== 3) {
        return false
      }
      const removed = event.removed[0]
      if (isCodeBlock(removed)) {
        return false
      }
      return true
    },

    swapAboveLine() {
      editor?.swapAboveLine()
      editor?.optimizeList()
    },

    swapBelowLine() {
      editor?.swapBelowLine()
      editor?.optimizeList()
    },

    goLineStart() {
      editor?.goLineStart()
    },
  },
})
</script>

<style lang="scss" scoped>
.editor-area {
  width: 100%;
  height: 100%;
}

#editor {
  width: 100%;
  height: 100%;
}
</style>
