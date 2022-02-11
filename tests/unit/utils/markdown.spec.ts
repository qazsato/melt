import {
  isCodeBlock,
  getDefaultCodeBlock,
  isList,
  isBulletList,
  isOrderedList,
  isTaskList,
  isTaskChecked,
  getListStartCh,
  getListPrefix,
  getListDepth,
  replaceListPrefix,
  replaceListNumber,
  getDefaultTable,
  isTableRow,
  getTableRow,
} from '@/utils/markdown'

test('コードブロックか判定する', () => {
  expect(isCodeBlock('```aaa')).toBeTruthy()
  expect(isCodeBlock('aaa```')).toBeFalsy()
  expect(isCodeBlock('`')).toBeFalsy()
  expect(isCodeBlock('``')).toBeFalsy()
})

test('コードブロックの定義文字を取得する', () => {
  expect(getDefaultCodeBlock()).toBe('```\n\n```')
})

test('リストか判定する', () => {
  expect(isList('- test')).toBeTruthy()
  expect(isList('* test')).toBeTruthy()
  expect(isList('+ test')).toBeTruthy()
  expect(isList('1. test')).toBeTruthy()
  expect(isList('- [ ] test')).toBeTruthy()
  expect(isList('* [ ] test')).toBeTruthy()
  expect(isList('+ [ ] test')).toBeTruthy()
  expect(isList('- [x] test')).toBeTruthy()
  expect(isList('* [x] test')).toBeTruthy()
  expect(isList('+ [x] test')).toBeTruthy()
  expect(isList('test')).toBeFalsy()
})

test('箇条書きリストか判定する', () => {
  expect(isBulletList('- test')).toBeTruthy()
  expect(isBulletList('* test')).toBeTruthy()
  expect(isBulletList('+ test')).toBeTruthy()
  expect(isBulletList('test')).toBeFalsy()
})

test('番号付きリストか判定する', () => {
  expect(isOrderedList('1. test')).toBeTruthy()
  expect(isOrderedList('test')).toBeFalsy()
})

test('タスクリストか判定する', () => {
  expect(isTaskList('- [ ] test')).toBeTruthy()
  expect(isTaskList('* [ ] test')).toBeTruthy()
  expect(isTaskList('+ [ ] test')).toBeTruthy()
  expect(isTaskList('- [x] test')).toBeTruthy()
  expect(isTaskList('* [x] test')).toBeTruthy()
  expect(isTaskList('+ [x] test')).toBeTruthy()
  expect(isTaskList('test')).toBeFalsy()
})

test('タスクがチェック済みか判定する', () => {
  expect(isTaskChecked('- [x] test')).toBeTruthy()
  expect(isTaskChecked('* [x] test')).toBeTruthy()
  expect(isTaskChecked('+ [x] test')).toBeTruthy()
  expect(isTaskChecked('- [ ] test')).toBeFalsy()
  expect(isTaskChecked('* [ ] test')).toBeFalsy()
  expect(isTaskChecked('+ [ ] test')).toBeFalsy()
  expect(isTaskChecked('test')).toBeFalsy()
})

test('リストのテキスト開始位置を取得する', () => {
  expect(getListStartCh('- test')).toBe(2)
  expect(getListStartCh('* test')).toBe(2)
  expect(getListStartCh('+ test')).toBe(2)
  expect(getListStartCh('1. test')).toBe(3)
  expect(getListStartCh('10. test')).toBe(4)
  expect(getListStartCh('100. test')).toBe(5)
  expect(getListStartCh('- [ ] test')).toBe(6)
  expect(getListStartCh('* [ ] test')).toBe(6)
  expect(getListStartCh('+ [ ] test')).toBe(6)
  expect(getListStartCh('- [x] test')).toBe(6)
  expect(getListStartCh('* [x] test')).toBe(6)
  expect(getListStartCh('+ [x] test')).toBe(6)
  expect(getListStartCh('test')).toBe(0)
})

test('リストの種別毎のプレフィックスを取得する', () => {
  expect(getListPrefix('bullet')).toBe('- ')
  expect(getListPrefix('ordered')).toBe('1. ')
  expect(getListPrefix('ordered', 99)).toBe('99. ')
  expect(getListPrefix('task')).toBe('- [ ] ')
  expect(getListPrefix('test')).toBe('')
})

test('リストの階層の深さを取得する', () => {
  expect(getListDepth('- test')).toBe(0)
  expect(getListDepth('\t- test')).toBe(1)
  expect(getListDepth('\t\t- test')).toBe(2)
  expect(getListDepth('\t\t\t- test')).toBe(3)
  expect(() => {
    getListDepth('test')
  }).toThrowError(new Error('list format error'))
})

test('リストの接頭語を置換する', () => {
  expect(replaceListPrefix('- test', '- [ ] ')).toBe('- [ ] test')
})

test('番号付きリストの番号を置換する', () => {
  expect(replaceListNumber('1. test', 2)).toBe('2. test')
})

test('テーブルを挿入する', () => {
  const table_3_3 = `
|     |     |     |
| --- | --- | --- |
|     |     |     |
|     |     |     |
`
  expect(getDefaultTable()).toBe(table_3_3.trimStart())
  const table_3_5 = `
|     |     |     |     |     |
| --- | --- | --- | --- | --- |
|     |     |     |     |     |
|     |     |     |     |     |
`
  expect(getDefaultTable(3, 5)).toBe(table_3_5.trimStart())
  const table_5_3 = `
|     |     |     |
| --- | --- | --- |
|     |     |     |
|     |     |     |
|     |     |     |
|     |     |     |
`
  expect(getDefaultTable(5, 3)).toBe(table_5_3.trimStart())
})

test('テーブルの行か判定する', () => {
  expect(isTableRow('| test | test |')).toBeTruthy()
  expect(isTableRow('test | test')).toBeFalsy()
})

test('テーブルの行を取得する', () => {
  expect(getTableRow('| a | b | c |').toString()).toBe('a,b,c')
})
