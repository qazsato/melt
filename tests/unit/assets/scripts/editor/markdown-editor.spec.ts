import { THEME } from '@/constants'
import Editor from '@/assets/scripts/editor/markdown-editor'

test('エディタを生成する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>'
  const editor = new Editor('editor', THEME.LIGHT)
  expect(editor).toBeDefined()
})

test('リンクを挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>'
  const editor = new Editor('editor', THEME.LIGHT)
  editor.insertLink('title', 'https://sample.com')
  expect(editor.getText()).toBe('[title](https://sample.com)')
})

test('画像を挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>'
  const editor = new Editor('editor', THEME.LIGHT)
  editor.insertImage('alt', 'https://sample.com/test.png')
  expect(editor.getText()).toBe('![alt](https://sample.com/test.png)')
})

test('太字を挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>'
  const editor = new Editor('editor', THEME.LIGHT)
  editor.insertBold()
  expect(editor.getText()).toBe('****')
})

test('斜体を挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>'
  const editor = new Editor('editor', THEME.LIGHT)
  editor.insertItalic()
  expect(editor.getText()).toBe('**')
})

test('打ち消し線を挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>'
  const editor = new Editor('editor', THEME.LIGHT)
  editor.insertStrikethrough()
  expect(editor.getText()).toBe('~~~~')
})

test('コードを挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>'
  const editor = new Editor('editor', THEME.LIGHT)
  editor.insertCode()
  expect(editor.getText()).toBe('``')
})

test('引用を挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>'
  const editor = new Editor('editor', THEME.LIGHT)
  editor.insertQuote()
  expect(editor.getText()).toBe('> ')
})

test('箇条書きリストを挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>'
  const editor = new Editor('editor', THEME.LIGHT)
  editor.insertBulletList()
  expect(editor.getText()).toBe('- ')
})

test('番号付きリストを挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>'
  const editor = new Editor('editor', THEME.LIGHT)
  editor.insertOrderedList()
  expect(editor.getText()).toBe('1. ')
})

test('タスクリストを挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>'
  const editor = new Editor('editor', THEME.LIGHT)
  editor.insertTaskList()
  expect(editor.getText()).toBe('- [ ] ')
})

test('テーブルを挿入する', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>'
  const editor = new Editor('editor', THEME.LIGHT)
  editor.insertTable()
  const table = '|     |     |     |\n| --- | --- | --- |\n|     |     |     |\n|     |     |     |\n'
  expect(editor.getText()).toBe(table)
})

test('タイトルを取得する(タイトル無)', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>'
  const editor = new Editor('editor', THEME.LIGHT)
  expect(editor.getTitle()).toBe('')
})

test('タイトルを取得する(タイトル有)', () => {
  document.body.innerHTML = '<textarea id="editor"></textarea>'
  const editor = new Editor('editor', THEME.LIGHT)
  editor.insert('# title\n')
  expect(editor.getTitle()).toBe('title')
})
