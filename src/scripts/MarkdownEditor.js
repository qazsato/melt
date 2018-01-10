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
  }
  /**
   * キーバインドを登録します。
   * @param {Object} map
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
   * @param {object} pos
   */
  insert(text, pos) {
    if (!pos) {
      pos = this.editor.getCursor();
    }
    this.editor.replaceRange(text, pos);
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
   * 太字を挿入します。
   */
  insertBold() {
    const pos = this.getSelectionPosition();
    const startX = pos.start.x;
    const startY = pos.start.y;
    const endX = pos.end.x;
    const endY = pos.end.y;
    if (startY === endY) {  // 単一行
      this.editor.replaceSelection(`**${this.getSelection()}**`);
      if (startX === endX) {
        this.moveCursorPosition(-2, 0); // NOTE 未選択時の場合は入力のしやすさを考慮しカーソル移動する。
      }
    } else {  // 複数行
      let lineText = '';
      for (let i = startY; i <= endY; i++) {
        const line = this.editor.getLine(i);
        if (line.trim() !== '') {
          if (i === startY && startX !== 0) {
            lineText += `**${line.slice(startX, line.length)}**`;
          } else if (i === endY && endX !== line.length) {
            lineText += `**${line.slice(0, endX)}**`;
          } else {
            lineText += `**${line}**`;
          }
        }
        if (i !== endY) {
          lineText += '\n';
        }
      }
      this.editor.replaceSelection('');
      this.insert(lineText, {line: startY, ch: startX});
    }
  }
  /**
   * 斜体を挿入します。
   */
  insertItalic() {
    this.insert(`_${this.getSelection()}_`);
    this.moveCursorPosition(-1, 0);
  }
  /**
   * 打ち消し線を挿入します。
   */
  insertStrikethrough() {
    this.insert(`~~${this.getSelection()}~~`);
    this.moveCursorPosition(-2, 0);
  }
  /**
   * コードを挿入します。
   */
  insertCode() {
    this.insert(`\`${this.getSelection()}\``);
    this.moveCursorPosition(-1, 0);
  }
  /**
   * 引用を挿入します。
   */
  insertQuote() {
    this.insertPrefix(`> `);
  }
  /**
   * 箇条書きリストを挿入します。
   */
  insertBulletedList() {
    this.insertPrefix(`- `);
  }
  /**
   * 番号付きリストを挿入します。
   */
  insertNumberedList() {
    this.insertPrefix(`1. `);
  }
  /**
   * チェックリストを挿入します。
   */
  insertCheckedList() {
    this.insertPrefix(`- [ ] `);
  }
}

module.exports = MarkdownEditor;
