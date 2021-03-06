import Editor from './editor.js';

class MarkdownEditor extends Editor {
  constructor(id) {
    const option = {
      mode: {
        name: 'gfm',
        highlightFormatting: true
      },
      theme: 'melt-light',
      lineWrapping: true,
      autofocus: true,
      indentUnit: 4,
      indentWithTabs: true,
      extraKeys: {
        Enter: 'newlineAndIndentContinueMarkdownList',
        Tab: (cm) => {
          const pos = this.editor.getCursor();
          let text = this.editor.getLine(pos.line);
          if (cm.somethingSelected()) {
            cm.indentSelection('add');
          } else {
            if (this.isBulletedList(text) || this.isNumberedList(text) || this.isCheckedList(text)) {
              cm.execCommand('goLineStart');
              cm.execCommand('insertTab');
              cm.execCommand('goLineEnd');
            } else {
              cm.execCommand('insertTab');
            }
          }
        }
      }
    };
    super(id, option);
  }
  /**
   * リンクを挿入します。
   * @param {string} title
   * @param {string} url
   */
  insertLink(title = '', url = '') {
    this.editor.replaceSelection(`[${title}](${url})`);
  }
  /**
   * 画像を挿入します。
   * @param {string} alt
   * @param {string} url
   */
  insertImage(alt = '', url = '') {
    this.editor.replaceSelection(`![${alt}](${url})`);
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
    this.putMarkInSelection('*');
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
    const pos = this.getSelectionPosition();
    if (pos.start.y === pos.end.y) {  // 単一行
      this.insertPrefix('> ');
    } else {  // 複数行
      let lineText = '';
      for (let i = pos.start.y; i <= pos.end.y; i++) {
        const line = this.editor.getLine(i);
        lineText += `> ${line}\t`;
        if (i !== pos.end.y) {
          lineText += '\n';
        }
      }
      const from = {line: pos.start.y, ch: 0};
      const to = {line: pos.end.y, ch: this.editor.getLine(pos.end.y).length};
      this.insert(lineText, from, to);
    }
  }
  /**
   * 箇条書きリストを挿入します。
   */
  insertBulletedList() {
    this.insertList('bullet');
  }
  /**
   * 番号付きリストを挿入します。
   */
  insertNumberedList() {
    this.insertList('number');
  }
  /**
   * チェックリストを挿入します。
   */
  insertCheckedList() {
    this.insertList('check');
  }
  /**
   * 箇条書きリストか判定します。
   */
  isBulletedList(lineText) {
    const trimed = lineText.trimLeft();
    if (trimed.indexOf('- ') === 0 ||
        trimed.indexOf('* ') === 0 ||
        trimed.indexOf('+ ') === 0) {
      return true;
    }
    return false;
  }
  /**
   * 番号付きリストか判定します。
   */
  isNumberedList(lineText) {
    const trimed = lineText.trimLeft();
    if (trimed.search(/^[0-9]+\./) !== -1) {
      return true;
    }
    return false;
  }
  /**
   * チェックリストか判定します。
   */
  isCheckedList(lineText) {
    const trimed = lineText.trimLeft();
    if (trimed.indexOf('- [ ]') === 0 ||
        trimed.indexOf('* [ ]') === 0 ||
        trimed.indexOf('+ [ ]') === 0 ||
        trimed.indexOf('- [x]') === 0 ||
        trimed.indexOf('* [x]') === 0 ||
        trimed.indexOf('+ [x]') === 0) {
      return true;
    }
    return false;
  }
  /**
   * テーブルを挿入します。
   */
  insertTable(row = 3, column = 3) {
    let tr = '';
    let th = '';
    for (let i = 0; i < row - 1; i++) {
      if (i === 0) {
        tr+= ' ';
        th+= ':-';
      }
      tr += ' | ';
      th += '|:-';
    }
    tr += '\n';
    th += '\n';

    let table = tr + th;
    for (let i = 0; i < column - 1; i++) {
      table += tr;
    }
    this.insert(table);
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
            lineText += `${mark}${line.slice(startX, line.length)}${mark}`;
          } else if (i === endY && endX !== line.length) {
            lineText += `${mark}${line.slice(0, endX)}${mark}`;
          } else {
            lineText += `${mark}${line}${mark}`;
          }
        }
        if (i !== endY) {
          lineText += '\n';
        }
      }
      this.insert(lineText, {line: startY, ch: startX}, {line: endY, ch: endX});
    }
  }
  /**
   * リストを挿入します。
   * @param {string} type
   */
  insertList(type) {
    const pos = this.getSelectionPosition();
    if (pos.start.y === pos.end.y) {  // 単一行
      const prefix = this.getListPrefix(type);
      this.insertPrefix(prefix);
    } else {  // 複数行
      let lineText = '';
      for (let i = pos.start.y; i <= pos.end.y; i++) {
        const line = this.editor.getLine(i);
        const number = i - pos.start.y + 1;
        const prefix = this.getListPrefix(type, number);
        lineText += `${prefix}${line}`;
        if (i !== pos.end.y) {
          lineText += '\n';
        }
      }
      const from = {line: pos.start.y, ch: 0};
      const to = {line: pos.end.y, ch: this.editor.getLine(pos.end.y).length};
      this.insert(lineText, from, to);
    }
  }
  /**
   * リストの種別毎のプレフィックスを返却します。
   * @param {string} type
   * @param {number} number
   */
  getListPrefix(type, number = 1) {
    if (type === 'bullet') {
      return `- `;
    } else if (type === 'number') {
      return `${number}. `;
    } else if (type === 'check') {
      return `- [ ] `;
    }
  }
  /**
   * 文書の見出し(Hタグ)を取得します。
   */
  getTitle() {
    const re = /# (.+)\n/.exec(this.editor.getValue());
    if (re === null) {
      return '';
    }
    return re[1];
  }
}

export default MarkdownEditor;
