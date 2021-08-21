import path from 'path'
import Note from '../src/assets/scripts/note/note'

test('新規ノートを作成されること', () => {
  const note = new Note()
  expect(note.title).toBe('Untitled')
  expect(note.content).toBe('')
  expect(note.tableOfContents).toEqual([])
  expect(note.isChanged).toBe(false)
})

test('新規ノートが更新されること', () => {
  const content = 'test'
  const note = new Note()
  note.update(content)
  expect(note.title).toBe('Untitled')
  expect(note.content).toBe(content)
  expect(note.tableOfContents).toEqual([])
  expect(note.isChanged).toBe(true)
})

test('新規ノートが保存されること', () => {
  const fileName = 'test.md'
  const content = 'test'
  const note = new Note()
  note.update(content)
  note.save(path.join(__dirname, fileName))
  expect(note.title).toBe(fileName)
  expect(note.content).toBe(content)
  expect(note.tableOfContents).toEqual([])
  expect(note.isChanged).toBe(false)
})

test('既存ノートが作成されること', () => {
  const fileName = 'test.md'
  const note = new Note(path.join(__dirname, fileName))
  expect(note.title).toBe(fileName)
  expect(note.content).toBe('test')
  expect(note.tableOfContents).toEqual([])
  expect(note.isChanged).toBe(false)
})

test('ノートを変更せず保存した場合何も変わらないこと', () => {
  const fileName = 'test.md'
  const note = new Note(path.join(__dirname, fileName))
  note.save()
  expect(note.title).toBe(fileName)
  expect(note.content).toBe('test')
  expect(note.tableOfContents).toEqual([])
  expect(note.isChanged).toBe(false)
})

test('拡張子がmd以外のファイル読み込みでエラーとなること', () => {
  const fileName = 'test.txt'
  expect(() => {
    // eslint-disable-next-line no-new
    new Note(path.join(__dirname, fileName))
  }).toThrowError(new Error('file extension must be md.'))
})

test('ノートの目次が作成されること', () => {
  const content = '# h1 Heading\n## h2 Heading\n### h3 Heading\n#### h4 Heading\n##### h5 Heading\n###### h6 Heading'
  const note = new Note()
  note.update(content)
  expect(note.tableOfContents[0].heading).toBe(1)
  expect(note.tableOfContents[0].text).toBe('h1 Heading')
  expect(note.tableOfContents[1].heading).toBe(2)
  expect(note.tableOfContents[1].text).toBe('h2 Heading')
  expect(note.tableOfContents[2].heading).toBe(3)
  expect(note.tableOfContents[2].text).toBe('h3 Heading')
  expect(note.tableOfContents[3].heading).toBe(4)
  expect(note.tableOfContents[3].text).toBe('h4 Heading')
  expect(note.tableOfContents[4].heading).toBe(5)
  expect(note.tableOfContents[4].text).toBe('h5 Heading')
  expect(note.tableOfContents[5].heading).toBe(6)
  expect(note.tableOfContents[5].text).toBe('h6 Heading')
})

test('ノートのテキスト検索をしたら結果が返ってくること', () => {
  const fileName = 'test.md'
  const note = new Note(path.join(__dirname, fileName))
  const results = note.find('t')
  expect(results).toEqual(['test'])
})
