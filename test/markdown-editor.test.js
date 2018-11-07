import Editor from '../src/assets/scripts/editor/markdown-editor';

test('エディタを生成する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  expect(editor).toBeDefined();
});

test('リンクを挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  editor.insertLink('title', 'https://sample.com');
  expect(editor.getText()).toBe('[title](https://sample.com)');
});

test('画像を挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  editor.insertImage('alt', 'https://sample.com/test.png');
  expect(editor.getText()).toBe('![alt](https://sample.com/test.png)');
});

test('太字を挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  editor.insertBold();
  expect(editor.getText()).toBe('****');
});

test('斜体を挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  editor.insertItalic();
  expect(editor.getText()).toBe('**');
});

test('打ち消し線を挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  editor.insertStrikethrough();
  expect(editor.getText()).toBe('~~~~');
});

test('コードを挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  editor.insertCode();
  expect(editor.getText()).toBe('``');
});

test('引用を挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  editor.insertQuote();
  expect(editor.getText()).toBe('> ');
});

test('箇条書きリストを挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  editor.insertBulletedList();
  expect(editor.getText()).toBe('- ');
});

test('番号付きリストを挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  editor.insertNumberedList();
  expect(editor.getText()).toBe('1. ');
});

test('チェックリストを挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  editor.insertCheckedList();
  expect(editor.getText()).toBe('- [ ] ');
});

test('箇条書きリストか判定する(true)', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  expect(editor.isBulletedList('- test')).toBeTruthy();
});

test('箇条書きリストか判定する(false)', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  expect(editor.isBulletedList('test')).toBeFalsy();
});

test('番号付きリストか判定する(true)', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  expect(editor.isNumberedList('1. test')).toBeTruthy();
});

test('番号付きリストか判定する(false)', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  expect(editor.isNumberedList('test')).toBeFalsy();
});

test('チェックリストか判定する チェック未(true)', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  expect(editor.isCheckedList('- [ ] test')).toBeTruthy();
});

test('チェックリストか判定する チェック済(true)', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  expect(editor.isCheckedList('- [x] test')).toBeTruthy();
});

test('チェックリストか判定する(false)', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  expect(editor.isCheckedList('test')).toBeFalsy();
});

test('テーブルを挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  editor.insertTable();
  const table = `  |  | \n:-|:-|:-\n  |  | \n  |  | \n`;
  expect(editor.getText()).toBe(table);
});

test('タイトルを取得する(タイトル無)', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  expect(editor.getTitle()).toBe('');
});

test('タイトルを取得する(タイトル有)', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  editor.insert('# title\n');
  expect(editor.getTitle()).toBe('title');
});
