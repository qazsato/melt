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
  replaceListPrefix,
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
    this.optimizeList(cm)
  }

  /**
   * Shift + Tab のハンドラ
   */
  onPressShiftTab(cm: CM): void {
    cm.execCommand('indentLess')
    this.optimizeList(cm)
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
      const prefix = getListPrefix(type)
      this.insertPrefix(prefix)
    } else {
      // 複数行
      let lineText = ''
      for (let i = pos.start.y; i <= pos.end.y; i++) {
        const line = this.editor.getLine(i)
        const number = i - pos.start.y + 1
        const prefix = getListPrefix(type, number)
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
    if (isList(text)) {
      const ch = getListStartCh(text)
      if (pos.ch > ch) {
        this.editor.setCursor({ line: pos.line, ch })
        return
      }
    }
    this.editor.execCommand('goLineStart')
  }

  getTableData(): TableData[] {
    const data: TableData[] = []
    const maxLine = this.editor.lineCount()
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

  optimizeList(cm: CM): void {
    const ranges = cm.listSelections()
    ranges.forEach((range) => {
      const pos = range.head
      const text = cm.getLine(pos.line)
      if (!isList(text)) {
        return
      }
      this.optimizeListPrefix(cm, pos)
    })
  }

  // cf. https://github.com/codemirror/CodeMirror/blob/master/addon/edit/continuelist.js
  optimizeListPrefix(cm: CM, pos: CodeMirror.Position): void {
    const startLine = this.getListStartLine(pos.line)
    let lookAhead = 0
    let item = null
    const allListItems: ListItem[] = []
    do {
      const lineNumber = startLine + lookAhead
      let lineText = cm.getLine(lineNumber)
      // 操作した行が番号付きリストの場合は、一番始まりとしたいため置換する
      if (lineNumber === pos.line && isOrderedList(lineText)) {
        lineText = replaceListNumber(lineText, 1)
      }
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
      allListItems.forEach((l: ListItem, i: number) => {
        if (l.depth === depth) {
          listItems.push(l)
          if (i !== allListItems.length - 1 && allListItems[i + 1].depth < depth) {
            listItemsByDepth.push(listItems)
            listItems = []
          }
        }
      })
      listItemsByDepth.push(listItems)

      listItemsByDepth.forEach((listItems: ListItem[]) => {
        listItems.forEach((l: ListItem, i: number) => {
          const firstText = listItems[0].text
          const firstItem = LIST_RE.exec(firstText)
          if (!firstItem) {
            return
          }
          if (isOrderedList(firstText)) {
            const text = replaceListNumber(l.text, Number(firstItem[2]) + i)
            this.setLineText(l.line, text)
          } else {
            const text = replaceListPrefix(l.text, firstItem[2])
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
