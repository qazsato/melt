import Note from '../src/assets/scripts/note/note'

test('新規ノートを作成する', () => {
  const note = new Note()
  expect(note.data).toBeDefined()
  note.delete()
})

test('既存ノートを読み込む', () => {
  const noteA = new Note()
  const path = noteA.readPath()
  const noteB = new Note(path)
  expect(noteB.data).toBeDefined()
  noteA.delete()
})

test('ノートのタイトルを更新する', () => {
  const note = new Note()
  note.updateTitle('テストタイトル')
  expect(note.readTitle()).toBe('テストタイトル')
  note.delete()
})

test('ノートの内容を更新する', () => {
  const note = new Note()
  note.updateContent('# テストコンテンツ')
  expect(note.readContent()).toBe('# テストコンテンツ')
  note.delete()
})

test('ノートのタグを追加する', () => {
  const note = new Note()
  note.registTag('タグA')
  expect(note.readTag()).toContain('タグA')
  note.delete()
})

test('ノートのタグを削除する', () => {
  const note = new Note()
  note.registTag('タグA')
  note.registTag('タグB')
  note.registTag('タグC')
  note.removeTag('タグB')
  expect(note.readTag()).not.toContain(['タグB'])
  note.delete()
})
