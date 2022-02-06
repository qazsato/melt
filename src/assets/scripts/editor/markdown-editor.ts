import { LIST_TYPE, ALLOW_DROP_FILE_TYPES } from '@/constants'
import { Editor as CM } from 'codemirror'
import Editor from './editor'
import 'codemirror/mode/gfm/gfm.js'
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/vue/vue.js'
import 'codemirror/mode/jsx/jsx.js'
import 'codemirror/mode/ruby/ruby.js'
import 'codemirror/mode/go/go.js'
import 'codemirror/mode/sql/sql.js'
import 'codemirror/mode/shell/shell.js'
import 'codemirror/addon/edit/continuelist.js'

class MarkdownEditor extends Editor {
  constructor(id: string, theme: string) {
    const option = {
      mode: {
        name: 'gfm',
        highlightFormatting: true,
      },
      theme: theme,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 4,
      indentWithTabs: true,
      dragDrop: true,
      allowDropFileTypes: ALLOW_DROP_FILE_TYPES,
      extraKeys: {
        Enter: 'newlineAndIndentContinueMarkdownList',
        Tab: (cm: CM) => {
          this.onPressTab(cm)
        },
        'Shift-Tab': (cm: CM) => {
          this.onPressShiftTab(cm)
        },
      },
    }
    super(id, option)
  }

  /**
   * Tabのハンドラ
   */
  onPressTab(cm: CM): void {
    const pos = this.editor.getCursor()
    const text = this.editor.getLine(pos.line)
    if (cm.somethingSelected()) {
      cm.indentSelection('add')
    } else {
      if (this.isList(text)) {
        if (this.isIndentableList(pos.line)) {
          cm.execCommand('goLineStart')
          cm.execCommand('insertTab')
          cm.execCommand('goLineEnd')
        }
      } else {
        cm.execCommand('insertTab')
      }
    }
  }

  /**
   * Shift + Tab のハンドラ
   */
  onPressShiftTab(cm: CM): void {
    cm.execCommand('indentLess')
  }

  /**
   * テキストを挿入します。
   * @param {string} text
   */
  insertText(text = ''): void {
    this.editor.replaceSelection(text)
  }

  /**
   * リンクを挿入します。
   * @param {string} title
   * @param {string} url
   */
  insertLink(title = '', url = ''): void {
    this.editor.replaceSelection(`[${title}](${url})`)
  }

  /**
   * 画像を挿入します。
   * @param {string} alt
   * @param {string} url
   * @param {boolean} isHtmlString
   */
  insertImage(alt = '', url = '', isHtmlString = false): void {
    const text = isHtmlString ? `<img alt="${alt}" src="${url}">` : `![${alt}](${url})`
    this.editor.replaceSelection(text)
  }

  /**
   * 太字を挿入します。
   */
  insertBold(): void {
    this.putMarkInSelection('**')
  }

  /**
   * 斜体を挿入します。
   */
  insertItalic(): void {
    this.putMarkInSelection('*')
  }

  /**
   * 打ち消し線を挿入します。
   */
  insertStrikethrough(): void {
    this.putMarkInSelection('~~')
  }

  /**
   * コードを挿入します。
   */
  insertCode(): void {
    this.putMarkInSelection('`')
  }

  /**
   * 引用を挿入します。
   */
  insertQuote(): void {
    const pos = this.getSelectionPosition()
    if (pos.start.y === pos.end.y) {
      // 単一行
      this.insertPrefix('> ')
    } else {
      // 複数行
      let lineText = ''
      for (let i = pos.start.y; i <= pos.end.y; i++) {
        const line = this.editor.getLine(i)
        lineText += `> ${line}\t`
        if (i !== pos.end.y) {
          lineText += '\n'
        }
      }
      const from = { line: pos.start.y, ch: 0 }
      const to = { line: pos.end.y, ch: this.editor.getLine(pos.end.y).length }
      this.insert(lineText, from, to)
    }
  }

  /**
   * 箇条書きリストを挿入します。
   */
  insertBulletList(): void {
    this.insertList(LIST_TYPE.BULLET)
  }

  /**
   * 番号付きリストを挿入します。
   */
  insertOrderedList(): void {
    this.insertList(LIST_TYPE.ORDERED)
  }

  /**
   * タスクリストを挿入します。
   */
  insertTaskList(): void {
    this.insertList(LIST_TYPE.TASK)
  }

  /**
   * リストか判定します。
   */
  isList(text: string): boolean {
    return this.isBulletList(text) || this.isOrderedList(text) || this.isTaskList(text)
  }

  /**
   * リストのテキスト開始位置を取得します
   * @param listText
   */
  getListStartCh(listText: string): number {
    const originalLength = listText.length
    const trimmedLength = listText.trimStart().length
    const diff = originalLength - trimmedLength
    const text = listText.trimStart()
    if (this.isTaskList(text)) {
      if (this.isTaskChecked(text)) {
        return text.indexOf(' [x] ') + diff + 5
      }
      return text.indexOf(' [ ] ') + diff + 5
    }
    return text.indexOf(' ') + diff + 1
  }

  /**
   * 箇条書きリストか判定します。
   */
  isBulletList(lineText: string): boolean {
    const text = lineText.trimStart()
    if (text.indexOf('- ') === 0 || text.indexOf('* ') === 0 || text.indexOf('+ ') === 0) {
      return true
    }
    return false
  }

  /**
   * 番号付きリストか判定します。
   */
  isOrderedList(lineText: string): boolean {
    const text = lineText.trimStart()
    if (text.search(/^[0-9]+\./) !== -1) {
      return true
    }
    return false
  }

  /**
   * タスクリストか判定します。
   */
  isTaskList(lineText: string): boolean {
    const text = lineText.trimStart()
    if (
      text.indexOf('- [ ]') === 0 ||
      text.indexOf('* [ ]') === 0 ||
      text.indexOf('+ [ ]') === 0 ||
      text.indexOf('- [x]') === 0 ||
      text.indexOf('* [x]') === 0 ||
      text.indexOf('+ [x]') === 0
    ) {
      return true
    }
    return false
  }

  /**
   * タスクがチェック済みか判定します。
   */
  isTaskChecked(lineText: string): boolean {
    const text = lineText.trimStart()
    if (text.indexOf('- [x]') === 0 || text.indexOf('* [x]') === 0 || text.indexOf('+ [x]') === 0) {
      return true
    }
    return false
  }

  /**
   * 対象行のリストがインデント可能か判定します。
   */
  isIndentableList(lineNumber: number): boolean {
    // 先頭行の場合、字下げ不要
    if (lineNumber === 0) {
      return false
    }
    const text = this.editor.getLine(lineNumber)
    const prevText = this.editor.getLine(lineNumber - 1)
    // 前の行がリストでない場合、字下げ不要
    if (!this.isList(prevText)) {
      return false
    }
    const tabCount = (text.match(/\t/g) || []).length
    const prevTabCount = (prevText.match(/\t/g) || []).length
    // タブ数が前の行より1以上開くことはないため、字下げ不要
    if (tabCount - prevTabCount >= 1) {
      return false
    }
    return true
  }

  /**
   * テーブルを挿入します。
   */
  insertTable(row = 3, column = 3): void {
    let tr = ''
    let th = ''
    for (let i = 0; i < row - 1; i++) {
      if (i === 0) {
        tr += ' '
        th += ':-'
      }
      tr += ' | '
      th += '|:-'
    }
    tr += '\n'
    th += '\n'

    let table = tr + th
    for (let i = 0; i < column - 1; i++) {
      table += tr
    }
    this.insert(table)
  }

  /**
   * 任意の文字列を選択されたテキストの前後に挿入します。
   * @param mark
   */
  putMarkInSelection(mark: string): void {
    const pos = this.getSelectionPosition()
    const startX = pos.start.x
    const startY = pos.start.y
    const endX = pos.end.x
    const endY = pos.end.y
    if (startY === endY) {
      // 単一行
      this.editor.replaceSelection(`${mark}${this.getSelection()}${mark}`)
      if (startX === endX) {
        this.moveCursorPosition(-1 * mark.length, 0) // NOTE 未選択時の場合は入力のしやすさを考慮しカーソル移動する。
      }
    } else {
      // 複数行
      let lineText = ''
      for (let i = startY; i <= endY; i++) {
        const line = this.editor.getLine(i)
        if (line.trim() !== '') {
          if (i === startY && startX !== 0) {
            lineText += `${mark}${line.slice(startX, line.length)}${mark}`
          } else if (i === endY && endX !== line.length) {
            lineText += `${mark}${line.slice(0, endX)}${mark}`
          } else {
            lineText += `${mark}${line}${mark}`
          }
        }
        if (i !== endY) {
          lineText += '\n'
        }
      }
      this.insert(lineText, { line: startY, ch: startX }, { line: endY, ch: endX })
    }
  }

  /**
   * リストを挿入します。
   * @param type
   */
  insertList(type: string): void {
    const pos = this.getSelectionPosition()
    if (pos.start.y === pos.end.y) {
      // 単一行
      const prefix = this.getListPrefix(type)
      this.insertPrefix(prefix)
    } else {
      // 複数行
      let lineText = ''
      for (let i = pos.start.y; i <= pos.end.y; i++) {
        const line = this.editor.getLine(i)
        const number = i - pos.start.y + 1
        const prefix = this.getListPrefix(type, number)
        lineText += `${prefix}${line}`
        if (i !== pos.end.y) {
          lineText += '\n'
        }
      }
      const from = { line: pos.start.y, ch: 0 }
      const to = { line: pos.end.y, ch: this.editor.getLine(pos.end.y).length }
      this.insert(lineText, from, to)
    }
  }

  /**
   * リストの種別毎のプレフィックスを返却します。
   * @param type
   * @param number
   */
  getListPrefix(type: string, number = 1): string {
    if (type === LIST_TYPE.BULLET) {
      return '- '
    } else if (type === LIST_TYPE.ORDERED) {
      return `${number}. `
    } else if (type === LIST_TYPE.TASK) {
      return '- [ ] '
    }
    return ''
  }

  /**
   * 文書の見出し(Hタグ)を取得します。
   */
  getTitle(): string {
    const re = /# (.+)\n/.exec(this.editor.getValue())
    if (re === null) {
      return ''
    }
    return re[1]
  }

  /**
   * 文の先頭にカーソルを移動します。
   */
  goLineStart(): void {
    const pos = this.editor.getCursor()
    const text = this.getLineText(pos.line)
    if (this.isList(text)) {
      const ch = this.getListStartCh(text)
      if (pos.ch > ch) {
        this.editor.setCursor({ line: pos.line, ch })
        return
      }
    }
    this.editor.execCommand('goLineStart')
  }
}

export default MarkdownEditor
