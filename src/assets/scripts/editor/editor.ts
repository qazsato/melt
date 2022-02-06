import CodeMirror, { EditorConfiguration, KeyMap, Position } from 'codemirror'

class Editor {
  editor: CodeMirror.Editor
  focused = false

  constructor(id: string, option: EditorConfiguration) {
    const element: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById(id)
    this.editor = CodeMirror.fromTextArea(element, option)
    this.editor.on('focus', () => {
      this.focused = true
    })
    this.editor.on('blur', () => {
      this.focused = false
    })
  }

  /**
   * テーマを設定します。
   * @param theme
   */
  setTheme(theme: string): void {
    this.editor.setOption('theme', theme)
  }

  /**
   * キーバインドを登録します。
   * @param map
   */
  addKeyMap(map: KeyMap): void {
    this.editor.addKeyMap(map)
  }

  /**
   * イベントを紐付けます。
   * @param event
   * @param handler
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  on(event: any, handler: any): void {
    this.editor.on(event, handler)
  }

  /**
   * エディタにフォーカスします。
   */
  focus(): void {
    this.editor.focus()
  }

  /**
   * 任意の文字を挿入します。
   * @param text
   * @param from {line, ch}
   * @param to {line, ch}
   */
  insert(text: string, from?: Position, to?: Position): void {
    if (!from) {
      from = this.editor.getCursor()
    }
    this.editor.replaceRange(text, from, to)
  }

  /**
   * 行の先頭に任意の文字を挿入します。
   * @param text
   */
  insertPrefix(text: string): void {
    const pos = this.editor.getCursor()
    this.editor.replaceRange(text, { line: pos.line, ch: 0 })
  }

  /**
   * エディタの文字を全て返却します。
   */
  getText(): string {
    return this.editor.getValue()
  }

  /**
   * エディタの文字を設定します。
   * @param val
   */
  setText(val: string): void {
    this.editor.setValue(val)
  }

  /**
   * 選択中の文字を返却します。
   */
  getSelection(): string {
    return this.editor.getSelection()
  }

  /**
   * 指定行数の文字を返却します。
   * @param number
   */
  getLineText(number: number): string {
    return this.editor.getLine(number)
  }

  /**
   * 指定行数の文字を設定します。
   * @param number
   * @param text
   */
  setLineText(number: number, text: string): void {
    const lineText = this.editor.getLine(number)
    this.editor.replaceRange(text, { line: number, ch: 0 }, { line: number, ch: lineText.length })
  }

  /**
   * 選択中の文字の開始位置と終了位置を返却します。
   */
  getSelectionPosition(): Pos {
    const selection = this.editor.listSelections()[0]
    const head = selection.head
    const anchor = selection.anchor
    // NOTE 三平方の定理でエディタの起点(0,0)からの距離を求め、start/endの判定を行う。
    const headDist = Math.sqrt(Math.pow(head.line, 2) + Math.pow(head.ch, 2))
    const anchorDist = Math.sqrt(Math.pow(anchor.line, 2) + Math.pow(anchor.ch, 2))
    let start
    let end
    if (headDist < anchorDist) {
      start = { x: head.ch, y: head.line }
      end = { x: anchor.ch, y: anchor.line }
    } else {
      start = { x: anchor.ch, y: anchor.line }
      end = { x: head.ch, y: head.line }
    }
    return { start, end }
  }

  /**
   * 任意の位置にカーソルを移動します。
   * @param {number} x X座標の相対値
   * @param {number} y Y座標の相対値
   */
  moveCursorPosition(x = 0, y = 0): void {
    const pos = this.editor.getCursor()
    this.editor.setCursor({ line: pos.line + y, ch: pos.ch + x })
  }

  /**
   * エディタがフォーカス中か否かを返却します。
   */
  isFocus(): boolean {
    return this.focused
  }

  /**
   * 指定行にカーソルを移動します
   * @param line
   */
  gotoLine(line: number): void {
    this.editor.setCursor({ ch: 0, line })
  }

  /**
   * 指定行を選択状態にします
   * @param line
   */
  selectLine(line: number): void {
    const text = this.getLineText(line)
    this.editor.setSelection({ line, ch: 0 }, { line, ch: text.length })
  }

  /**
   * 指定行同士のテキストを入れ替えます
   * @param fromLine
   * @param toLine
   */
  swapLine(fromLine: number, toLine: number): void {
    const fromText = this.editor.getLine(fromLine)
    const toText = this.editor.getLine(toLine)
    this.editor.replaceRange(fromText, { line: toLine, ch: 0 }, { line: toLine, ch: toText.length })
    this.editor.replaceRange(toText, { line: fromLine, ch: 0 }, { line: fromLine, ch: fromText.length })
  }

  swapAboveLine(): void {
    const isSelection = !!this.getSelection()
    if (isSelection) {
      const pos = this.getSelectionPosition()
      const minLine = pos.start.y
      const maxLine = pos.end.x === 0 ? pos.end.y - 1 : pos.end.y
      if (minLine === 0) {
        return
      }
      for (let line = minLine; line <= maxLine; line++) {
        this.swapLine(line, line - 1)
      }
      this.editor.setSelection({ line: pos.end.y - 1, ch: pos.end.x }, { line: pos.start.y - 1, ch: pos.start.x })
    } else {
      const position = this.editor.getCursor()
      const fromLine = position.line
      const toLine = fromLine - 1
      if (fromLine === 0) {
        return
      }
      this.swapLine(fromLine, toLine)
      this.editor.setCursor({ line: toLine, ch: position.ch })
    }
  }

  swapBelowLine(): void {
    const isSelection = !!this.getSelection()
    if (isSelection) {
      const pos = this.getSelectionPosition()
      const minLine = pos.start.y
      const maxLine = pos.end.x === 0 ? pos.end.y - 1 : pos.end.y
      if (maxLine === this.editor.lineCount() - 1) {
        return
      }
      for (let line = maxLine; line >= minLine; line--) {
        this.swapLine(line, line + 1)
      }
      this.editor.setSelection({ line: pos.end.y + 1, ch: pos.end.x }, { line: pos.start.y + 1, ch: pos.start.x })
    } else {
      const position = this.editor.getCursor()
      const fromLine = position.line
      const toLine = fromLine + 1
      if (fromLine === this.editor.lineCount() - 1) {
        return
      }
      this.swapLine(fromLine, toLine)
      this.editor.setCursor({ line: toLine, ch: position.ch })
    }
  }
}

interface Pos {
  start: {
    x: number
    y: number
  }
  end: {
    x: number
    y: number
  }
}

export default Editor
