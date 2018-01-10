const Editor = require('./Editor');

class MarkdownEditor extends Editor {
  constructor(id) {
    const option = {
      mode: 'gfm',
      theme: 'base16-light',
      lineWrapping: true,
      autofocus: true,
      indentUnit: 4,
      indentWithTabs: true,
      extraKeys: {'Enter': 'newlineAndIndentContinueMarkdownList'}
    };
    super(id, option);
  }
  /**
   * 太字を挿入します。
   */
  insertBold() {
    this.putMarkInSelection('**');
  }
  /**
   * 斜体を挿入します。
   */
  insertItalic() {
    this.putMarkInSelection('_');
  }
  /**
   * 打ち消し線を挿入します。
   */
  insertStrikethrough() {
    this.putMarkInSelection('~~');
  }
  /**
   * コードを挿入します。
   */
  insertCode() {
    this.putMarkInSelection('`');
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
  /**
   * 任意の文字列を選択されたテキストの前後に挿入します。
   * @param {string} mark
   */
  putMarkInSelection(mark) {
    const pos = this.getSelectionPosition();
    const startX = pos.start.x;
    const startY = pos.start.y;
    const endX = pos.end.x;
    const endY = pos.end.y;
    if (startY === endY) {  // 単一行
      this.editor.replaceSelection(`${mark}${this.getSelection()}${mark}`);
      if (startX === endX) {
        this.moveCursorPosition(-1 * mark.length, 0); // NOTE 未選択時の場合は入力のしやすさを考慮しカーソル移動する。
      }
    } else {  // 複数行
      let lineText = '';
      for (let i = startY; i <= endY; i++) {
        const line = this.editor.getLine(i);
        if (line.trim() !== '') {
          if (i === startY && startX !== 0) {
            lineText += ` ${mark}${line.slice(startX, line.length)}${mark}`;
          } else if (i === endY && endX !== line.length) {
            lineText += `${mark}${line.slice(0, endX)}${mark} `;
          } else {
            lineText += `${mark}${line}${mark}`;
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
}

module.exports = MarkdownEditor;
