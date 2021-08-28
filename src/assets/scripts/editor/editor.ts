import CodeMirror, { EditorConfiguration, KeyMap, Position } from 'codemirror'

class Editor {
  editor: any = null
  focused: boolean = false

  constructor (id: string, option: EditorConfiguration) {
    const element: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById(id)
    this.editor = CodeMirror.fromTextArea(element, option)
    this.editor.on('focus', () => { this.focused = true })
    this.editor.on('blur', () => { this.focused = false })
  }

  /**
   * キーバインドを登録します。
   * @param map
   */
  addKeyMap (map: KeyMap) {
    this.editor.addKeyMap(map)
  }

  /**
   * イベントを紐付けます。
   * @param event
   * @param handler
   */
  on (event: string, handler: () => void) {
    this.editor.on(event, handler)
  }

  /**
   * エディタにフォーカスします。
   */
  focus () {
    this.editor.focus()
  }

  /**
   * 任意の文字を挿入します。
   * @param text
   * @param from {line, ch}
   * @param to {line, ch}
   */
  insert (text: string, from?: Position, to?: Position) {
    if (!from) {
      from = this.editor.getCursor()
    }
    this.editor.replaceRange(text, from, to)
  }

  /**
   * 行の先頭に任意の文字を挿入します。
   * @param text
   */
  insertPrefix (text: string) {
    const pos = this.editor.getCursor()
    this.editor.replaceRange(text, { line: pos.line, ch: 0 })
  }

  /**
   * エディタの文字を全て返却します。
   */
  getText () {
    return this.editor.getValue()
  }

  /**
   * エディタの文字を設定します。
   * @param val
   */
  setText (val: string) {
    this.editor.setValue(val)
  }

  /**
   * 選択中の文字を返却します。
   */
  getSelection () {
    return this.editor.getSelection()
  }

  /**
   * 指定行数の文字を返却します。
   * @param number
   */
  getLineText (number: number) {
    return this.editor.getLine(number)
  }

  /**
   * 選択中の文字の開始位置と終了位置を返却します。
   */
  getSelectionPosition () {
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
  moveCursorPosition (x = 0, y = 0) {
    const pos = this.editor.getCursor()
    this.editor.setCursor({ line: pos.line + y, ch: pos.ch + x })
  }

  /**
   * エディタがフォーカス中か否かを返却します。
   */
  isFocus () {
    return this.focused
  }

  /**
   * 指定行にカーソルを移動します
   * @param line
   */
  gotoLine (line: number) {
    this.editor.setCursor({ pos: 0, line })
  }

  /**
   * 指定行を選択状態にします
   * @param line
   */
  selectLine (line: number) {
    const text = this.getLineText(line)
    this.editor.setSelection({ line, ch: 0 }, { line, ch: text.length })
  }
}

export default Editor
