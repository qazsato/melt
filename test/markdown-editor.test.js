import Editor from '../src/assets/scripts/markdown-editor';

test('エディタを生成する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>';
  const editor = new Editor('editor');
  expect(editor).toBeDefined();
});
