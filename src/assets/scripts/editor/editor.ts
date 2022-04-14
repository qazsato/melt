import CodeMirror, { EditorConfiguration, KeyMap, Position } from 'codemirror'

class Editor {
  cm: CodeMirror.Editor
  focused = false

  constructor(id: string, option: EditorConfiguration) {
    const element: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById(id)
    this.cm = CodeMirror.fromTextArea(element, option)
    this.cm.on('focus', () => {
      this.focused = true
    })
    this.cm.on('blur', () => {
      this.focused = false
    })
  }

  /**
   * キーバインドを登録します。
   * @param map
   */
  addKeyMap(map: KeyMap): void {
    this.cm.addKeyMap(map)
  }

  /**
   * イベントを紐付けます。
   * @param event
   * @param handler
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  on(event: any, handler: any): void {
    this.cm.on(event, handler)
  }

  /**
   * エディタにフォーカスします。
   */
  focus(): void {
    this.cm.focus()
  }

  /**
   * 任意の文字を挿入します。
   * @param text
   * @param from {line, ch}
   * @param to {line, ch}
   */
  insert(text: string, from?: Position, to?: Position): void {
    if (!from) {
      from = this.cm.getCursor()
    }
    this.cm.replaceRange(text, from, to)
  }

  /**
   * 行の先頭に任意の文字を挿入します。
   * @param text
   */
  insertPrefix(text: string): void {
    const pos = this.cm.getCursor()
    this.cm.replaceRange(text, { line: pos.line, ch: 0 })
  }

  /**
   * エディタの文字を全て返却します。
   */
  getText(): string {
    return this.cm.getValue()
  }

  /**
   * エディタの文字を設定します。
   * @param val
   */
  setText(val: string): void {
    this.cm.setValue(val)
  }

  /**
   * 選択中の文字を返却します。
   */
  getSelection(): string {
    return this.cm.getSelection()
  }

  /**
   * 指定行数の文字を返却します。
   * @param number
   */
  getLineText(number: number): string {
    return this.cm.getLine(number)
  }

  /**
   * 指定行数の文字を設定します。
   * @param number
   * @param text
   */
  setLineText(number: number, text: string): void {
    const lineText = this.cm.getLine(number)
    this.cm.replaceRange(text, { line: number, ch: 0 }, { line: number, ch: lineText.length })
  }

  /**
   * 選択中の文字の開始位置と終了位置を返却します。
   */
  getSelectionPosition(): Pos {
    const selection = this.cm.listSelections()[0]
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
    const pos = this.cm.getCursor()
    this.cm.setCursor({ line: pos.line + y, ch: pos.ch + x })
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
    this.cm.setCursor({ ch: 0, line })
  }

  /**
   * 指定行を選択状態にします
   * @param line
   */
  selectLine(line: number): void {
    const text = this.getLineText(line)
    this.cm.setSelection({ line, ch: 0 }, { line, ch: text.length })
  }

  /**
   * 指定行同士のテキストを入れ替えます
   * @param fromLine
   * @param toLine
   */
  swapLine(fromLine: number, toLine: number): void {
    const fromText = this.cm.getLine(fromLine)
    const toText = this.cm.getLine(toLine)
    this.cm.replaceRange(fromText, { line: toLine, ch: 0 }, { line: toLine, ch: toText.length })
    this.cm.replaceRange(toText, { line: fromLine, ch: 0 }, { line: fromLine, ch: fromText.length })
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
      this.cm.setSelection({ line: pos.end.y - 1, ch: pos.end.x }, { line: pos.start.y - 1, ch: pos.start.x })
    } else {
      const position = this.cm.getCursor()
      const fromLine = position.line
      const toLine = fromLine - 1
      if (fromLine === 0) {
        return
      }
      this.swapLine(fromLine, toLine)
      this.cm.setCursor({ line: toLine, ch: position.ch })
    }
  }

  swapBelowLine(): void {
    const isSelection = !!this.getSelection()
    if (isSelection) {
      const pos = this.getSelectionPosition()
      const minLine = pos.start.y
      const maxLine = pos.end.x === 0 ? pos.end.y - 1 : pos.end.y
      if (maxLine === this.cm.lineCount() - 1) {
        return
      }
      for (let line = maxLine; line >= minLine; line--) {
        this.swapLine(line, line + 1)
      }
      this.cm.setSelection({ line: pos.end.y + 1, ch: pos.end.x }, { line: pos.start.y + 1, ch: pos.start.x })
    } else {
      const position = this.cm.getCursor()
      const fromLine = position.line
      const toLine = fromLine + 1
      if (fromLine === this.cm.lineCount() - 1) {
        return
      }
      this.swapLine(fromLine, toLine)
      this.cm.setCursor({ line: toLine, ch: position.ch })
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
