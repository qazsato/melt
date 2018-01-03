class Editor {
  constructor(id) {
    this.editor = ace.edit(id);
    this.editor.setFontSize(14);
    this.editor.setTheme('ace/theme/monokai');
    this.session = this.editor.getSession();
    this.session.setUseWrapMode(true);
    this.session.setTabSize(2);
    this.session.setMode('ace/mode/markdown');
  }
  /**
   * イベントを紐付けます。
   * @param {string} event
   * @param {function} handler
   */
  on(event, handler) {
    this.editor.getSession().on(event, handler);
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
   */
  insert(text) {
    this.editor.insert(text);
  }
  /**
   * 行の先頭に任意の文字を挿入します。
   * @param {*} text
   */
  insertPrefix(text) {
    const pos = this.editor.getCursorPosition();
    this.editor.session.insert({row: pos.row, column: 0}, text);
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
  getCopyText() {
    return this.editor.getCopyText();
  }
  /**
   * 任意の位置にカーソルを移動します。
   * @param {number} x X座標の相対値
   * @param {number} y Y座標の相対値
   */
  moveCursorPosition(x = 0, y = 0) {
    const pos = this.editor.getCursorPosition();
    this.editor.gotoLine(pos.row + 1 + y, pos.column + x);
  }
}

module.exports = Editor;
