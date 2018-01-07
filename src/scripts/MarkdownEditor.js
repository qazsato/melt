class MarkdownEditor {
  constructor(id) {
    const CodeMirror = require('codemirror');
    this.editor = CodeMirror.fromTextArea(document.getElementById(id), {
      mode: 'gfm',
      theme: 'base16-light',
      lineWrapping: true,
      autofocus: true,
      indentUnit: 4,
      indentWithTabs: true,
      extraKeys: {'Enter': 'newlineAndIndentContinueMarkdownList'}
    });
    this.editor.addKeyMap({
      'Cmd-L': () => this.insertLink(),
      'Cmd-G': () => this.insertImage(),
      'Cmd-B': () => this.insertBold(),
      'Cmd-I': () => this.insertItalic(),
      'Shift-Cmd-X': () => this.insertStrikethrough(),
      'Cmd-K': () => this.insertCode(),
      'Cmd-O': () => this.insertBulletedList(),
      'Cmd-U': () => this.insertNumberedList(),
      'Cmd-Y': () => this.insertCheckedList()
    });
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
   */
  insert(text) {
    this.editor.replaceSelection(text);
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
   * 任意の位置にカーソルを移動します。
   * @param {number} x X座標の相対値
   * @param {number} y Y座標の相対値
   */
  moveCursorPosition(x = 0, y = 0) {
    const pos = this.editor.getCursor();
    this.editor.setCursor({line: pos.line + y, ch: pos.ch + x});
  }
  insertLink() {
    this.insert(`[](${this.getSelection()})`);
    this.moveCursorPosition(-1, 0);
  }
  insertImage() {
    this.insert(`![](${this.getSelection()})`);
    this.moveCursorPosition(-1, 0);
  }
  insertBold() {
    this.insert(`**${this.getSelection()}**`);
    this.moveCursorPosition(-2, 0);
  }
  insertItalic() {
    this.insert(`_${this.getSelection()}_`);
    this.moveCursorPosition(-1, 0);
  }
  insertStrikethrough() {
    this.insert(`~~${this.getSelection()}~~`);
    this.moveCursorPosition(-2, 0);
  }
  insertCode() {
    this.insert(`\`${this.getSelection()}\``);
    this.moveCursorPosition(-1, 0);
  }
  insertQuote() {
    this.insertPrefix(`> `);
  }
  insertBulletedList() {
    this.insertPrefix(`- `);
  }
  insertNumberedList() {
    this.insertPrefix(`1. `);
  }
  insertCheckedList() {
    this.insertPrefix(`- [ ] `);
  }
}

module.exports = MarkdownEditor;
