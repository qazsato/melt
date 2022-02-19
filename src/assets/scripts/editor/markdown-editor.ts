import { LIST_TYPE, LIST_RE, ALLOW_DROP_FILE_TYPES } from '@/constants'
import { getCharWidth } from '@/utils/string'
import {
  isList,
  isOrderedList,
  getListStartCh,
  getListPrefix,
  getDefaultTable,
  getListDepth,
  replaceListNumber,
  isTableRow,
  getTableRow,
} from '@/utils/markdown'
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
import './addon/melt_gfm.js'

interface TableData {
  start: number
  end: number
  rows: string[][]
}

interface ListItem {
  line: number
  text: string
  depth: number
}

class MarkdownEditor extends Editor {
  constructor(id: string, theme: string) {
    const option = {
      mode: {
        name: 'melt_gfm',
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
    const pos = this.cm.getCursor()
    const text = this.cm.getLine(pos.line)
    if (cm.somethingSelected()) {
      cm.indentSelection('add')
    } else {
      if (isList(text)) {
        if (this.isIndentableList(pos.line)) {
          cm.execCommand('goLineStart')
          cm.execCommand('insertTab')
          cm.execCommand('goLineEnd')
        }
      } else {
        cm.execCommand('insertTab')
      }
    }
    this.optimizeList()
  }

  /**
   * Shift + Tab のハンドラ
   */
  onPressShiftTab(cm: CM): void {
    cm.execCommand('indentLess')
    this.optimizeList()
  }

  /**
   * テキストを挿入します。
   * @param {string} text
   */
  insertText(text = ''): void {
    this.cm.replaceSelection(text)
  }

  /**
   * リンクを挿入します。
   * @param {string} title
   * @param {string} url
   */
  insertLink(title = '', url = ''): void {
    this.cm.replaceSelection(`[${title}](${url})`)
  }

  /**
   * 画像を挿入します。
   * @param {string} alt
   * @param {string} url
   * @param {boolean} isHtmlString
   */
  insertImage(alt = '', url = '', isHtmlString = false): void {
    const text = isHtmlString ? `<img alt="${alt}" src="${url}">` : `![${alt}](${url})`
    this.cm.replaceSelection(text)
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
        const line = this.cm.getLine(i)
        lineText += `> ${line}\t`
        if (i !== pos.end.y) {
          lineText += '\n'
        }
      }
      const from = { line: pos.start.y, ch: 0 }
      const to = { line: pos.end.y, ch: this.cm.getLine(pos.end.y).length }
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
   * 対象行のリストがインデント可能か判定します。
   */
  isIndentableList(lineNumber: number): boolean {
    // 先頭行の場合、字下げ不要
    if (lineNumber === 0) {
      return false
    }
    const text = this.cm.getLine(lineNumber)
    const prevText = this.cm.getLine(lineNumber - 1)
    // 前の行がリストでない場合、字下げ不要
    if (!isList(prevText)) {
      return false
    }
    const depth = getListDepth(text)
    const prevDepth = getListDepth(prevText)
    // タブ数が前の行より1以上開くことはないため、字下げ不要
    if (depth - prevDepth >= 1) {
      return false
    }
    return true
  }

  /**
   * テーブルを挿入します。
   */
  insertTable(row = 3, column = 3): void {
    const table = getDefaultTable(row, column)
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
      this.cm.replaceSelection(`${mark}${this.getSelection()}${mark}`)
      if (startX === endX) {
        this.moveCursorPosition(-1 * mark.length, 0) // NOTE 未選択時の場合は入力のしやすさを考慮しカーソル移動する。
      }
    } else {
      // 複数行
      let lineText = ''
      for (let i = startY; i <= endY; i++) {
        const line = this.cm.getLine(i)
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
      const prefix = getListPrefix(type)
      this.insertPrefix(prefix)
    } else {
      // 複数行
      let lineText = ''
      for (let i = pos.start.y; i <= pos.end.y; i++) {
        const line = this.cm.getLine(i)
        const number = i - pos.start.y + 1
        const prefix = getListPrefix(type, number)
        lineText += `${prefix}${line}`
        if (i !== pos.end.y) {
          lineText += '\n'
        }
      }
      const from = { line: pos.start.y, ch: 0 }
      const to = { line: pos.end.y, ch: this.cm.getLine(pos.end.y).length }
      this.insert(lineText, from, to)
    }
  }

  /**
   * 文書の見出し(Hタグ)を取得します。
   */
  getTitle(): string {
    const re = /# (.+)\n/.exec(this.cm.getValue())
    if (re === null) {
      return ''
    }
    return re[1]
  }

  /**
   * 文の先頭にカーソルを移動します。
   */
  goLineStart(): void {
    const pos = this.cm.getCursor()
    const text = this.getLineText(pos.line)
    if (isList(text)) {
      const ch = getListStartCh(text)
      if (pos.ch > ch) {
        this.cm.setCursor({ line: pos.line, ch })
        return
      }
    }
    this.cm.execCommand('goLineStart')
  }

  getTableData(): TableData[] {
    const data: TableData[] = []
    const maxLine = this.cm.lineCount()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let d: any = { start: null, end: null, rows: [] }
    for (let i = 0; i < maxLine; i++) {
      const lineText = this.getLineText(i)
      if (isTableRow(lineText)) {
        if (d.start === null) {
          d.start = i
        }
        d.end = i
        d.rows.push(getTableRow(lineText))
      } else if (d.start !== null) {
        data.push(d)
        d = { start: null, end: null, rows: [] }
      }
    }
    if (d.start !== null) {
      data.push(d)
    }
    return data
  }

  optimizeTable(): void {
    const tableData = this.getTableData()
    tableData.forEach((d: TableData) => {
      const rows = d.rows
      rows.forEach((row: string[], i: number) => {
        const padRowStr = row.map((cell: string, n: number) => {
          const maxWidth = rows
            .map((row: string[], m: number) => {
              if (m === 1) {
                return 3 // 区切り行は最低3つ確保	する
              }
              return getCharWidth(row[n].trim())
            })
            .reduce((a: number, b: number) => Math.max(a, b))
          let str = cell.trim()
          if (i === 1) {
            // NOTE: 区切り行は 先頭/末尾 に ':' が設定可能なため、先頭/末尾のみ文字判定する
            const first = str.slice(0, 1) === ':' ? ':' : '-'
            const last = str.slice(-1) === ':' ? ':' : '-'
            return `${first}${''.padEnd(maxWidth - 2, '-')}${last}`
          }
          const diff = maxWidth - getCharWidth(str)
          if (diff % 1 === 0.5) {
            str += '　' // 端数がある場合は全角スペース(1.5)で幅を調整する
            return str.padEnd(str.length + diff - 1, ' ')
          }
          return str.padEnd(str.length + diff, ' ')
        })
        const text = `| ${padRowStr.join(' | ')} |`
        this.setLineText(d.start + i, text)
      })
    })
  }

  optimizeList(): void {
    const ranges = this.cm.listSelections()
    ranges.forEach((range) => {
      const pos = range.head.line <= range.anchor.line ? range.head : range.anchor
      const text = this.cm.getLine(pos.line)
      if (!isList(text)) {
        return
      }
      this.optimizeListPrefix(pos)
    })
  }

  // cf. https://github.com/codemirror/CodeMirror/blob/master/addon/edit/continuelist.js
  optimizeListPrefix(pos: CodeMirror.Position): void {
    const startLine = this.getListStartLine(pos.line)
    let lookAhead = 0
    let item = null
    const allListItems: ListItem[] = []
    do {
      const lineNumber = startLine + lookAhead
      const lineText = this.cm.getLine(lineNumber)
      item = !!(lineText && isList(lineText))
      if (item) {
        allListItems.push({
          line: lineNumber,
          text: lineText,
          depth: getListDepth(lineText),
        })
      }
      lookAhead++
    } while (item)

    const maxDepth = allListItems.map((l: ListItem) => l.depth).reduce((a: number, b: number) => Math.max(a, b))
    for (let depth = 0; depth <= maxDepth; depth++) {
      const listItemsByDepth: ListItem[][] = []
      let listItems: ListItem[] = []
      allListItems.forEach((l: ListItem) => {
        if (l.depth === depth) {
          listItems.push(l)
        } else if (l.depth < depth) {
          if (listItems.length > 0) {
            listItemsByDepth.push(listItems)
            listItems = []
          }
        }
      })
      if (listItems.length > 0) {
        listItemsByDepth.push(listItems)
      }
      listItemsByDepth.forEach((listItems: ListItem[]) => {
        listItems.forEach((l: ListItem, i: number) => {
          const firstText = listItems[0].text
          if (isOrderedList(firstText)) {
            const text = replaceListNumber(l.text, i + 1)
            this.setLineText(l.line, text)
          }
        })
      })
    }
  }

  getListStartLine(lineNumber: number): number {
    for (let i = lineNumber; i >= 0; i--) {
      const text = this.getLineText(i)
      if (!isList(text)) {
        return i + 1
      }
    }
    return 0
  }
}

export default MarkdownEditor
