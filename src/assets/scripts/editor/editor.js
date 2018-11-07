import CodeMirror from 'codemirror';

class Editor {
  constructor(id, option) {
    CodeMirror.keyMap.default['Tab'] = 'indentMore';
    CodeMirror.keyMap.default['Shift-Tab'] = 'indentLess';
    this.editor = CodeMirror.fromTextArea(document.getElementById(id), option);
    this.focused = false;
    this.editor.on('focus', () => this.focused = true);
    this.editor.on('blur', () => this.focused = false);
  }
  /**
   * キーバインドを登録します。
   * @param {object} map
   */
  addKeyMap(map) {
    this.editor.addKeyMap(map);
  }
  /**
   * イベントを紐付けます。
   * @param {string} event
   * @param {function} handler
   */
  on(event, handler) {
    this.editor.on(event, handler);
  }
  /**
   * エディタにフォーカスします。
   */
  focus() {
    this.editor.focus();
  }
  /**
   * 任意の文字を挿入します。
   * @param {string} text
   * @param {object} from {line, ch}
   * @param {object} to {line, ch}
   */
  insert(text, from, to) {
    if (!from) {
      from = this.editor.getCursor();
    }
    this.editor.replaceRange(text, from, to);
  }
  /**
   * 行の先頭に任意の文字を挿入します。
   * @param {string} text
   */
  insertPrefix(text) {
    const pos = this.editor.getCursor();
    this.editor.replaceRange(text, {line: pos.line, ch: 0});
  }
  /**
   * エディタの文字を全て返却します。
   */
  getText() {
    return this.editor.getValue();
  }
  /**
   * 選択中の文字を返却します。
   */
  getSelection() {
    return this.editor.getSelection();
  }
  /**
   * 選択中の文字の開始位置と終了位置を返却します。
   */
  getSelectionPosition() {
    const selection = this.editor.listSelections()[0];
    const head = selection.head;
    const anchor = selection.anchor;
    // NOTE 三平方の定理でエディタの起点(0,0)からの距離を求め、start/endの判定を行う。
    const headDist = Math.sqrt(Math.pow(head.line, 2) + Math.pow(head.ch, 2));
    const anchorDist = Math.sqrt(Math.pow(anchor.line, 2) + Math.pow(anchor.ch, 2));
    let start;
    let end;
    if (headDist < anchorDist) {
      start = {x: head.ch, y: head.line};
      end = {x: anchor.ch, y: anchor.line};
    } else {
      start = {x: anchor.ch, y: anchor.line};
      end = {x: head.ch, y: head.line};
    }
    return {start, end};
  }
  /**
   * 任意の位置にカーソルを移動します。
   * @param {number} x X座標の相対値
   * @param {number} y Y座標の相対値
   */
  moveCursorPosition(x = 0, y = 0) {
    const pos = this.editor.getCursor();
    this.editor.setCursor({line: pos.line + y, ch: pos.ch + x});
  }
  /**
   * エディタがフォーカス中か否かを返却します。
   */
  isFocus() {
    return this.focused;
  }
}

export default Editor;
