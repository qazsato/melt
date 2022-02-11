import { LIST_TYPE, LIST_RE } from '@/constants'

/**
 * コードブロックか判定。
 */
export const isCodeBlock = (lineText: string): boolean => {
  return lineText.indexOf('```') === 0
}

/**
 * コードブロックの定義文字を返却。
 */
export const getDefaultCodeBlock = (): string => {
  return '```\n\n```'
}

/**
 * リストか判定。
 */
export const isList = (lineText: string): boolean => {
  return isBulletList(lineText) || isOrderedList(lineText) || isTaskList(lineText)
}

/**
 * 箇条書きリストか判定。
 */
export const isBulletList = (lineText: string): boolean => {
  const text = lineText.trimStart()
  if (text.indexOf('- ') === 0 || text.indexOf('* ') === 0 || text.indexOf('+ ') === 0) {
    return true
  }
  return false
}

/**
 * 番号付きリストか判定。
 */
export const isOrderedList = (lineText: string): boolean => {
  const text = lineText.trimStart()
  if (text.search(/^[0-9]+\./) !== -1) {
    return true
  }
  return false
}

/**
 * タスクリストか判定。
 */
export const isTaskList = (lineText: string): boolean => {
  const text = lineText.trimStart()
  if (
    text.indexOf('- [ ]') === 0 ||
    text.indexOf('* [ ]') === 0 ||
    text.indexOf('+ [ ]') === 0 ||
    text.indexOf('- [x]') === 0 ||
    text.indexOf('* [x]') === 0 ||
    text.indexOf('+ [x]') === 0
  ) {
    return true
  }
  return false
}

/**
 * タスクがチェック済みか判定。
 */
export const isTaskChecked = (lineText: string): boolean => {
  const text = lineText.trimStart()
  if (text.indexOf('- [x]') === 0 || text.indexOf('* [x]') === 0 || text.indexOf('+ [x]') === 0) {
    return true
  }
  return false
}

/**
 * リストのテキスト開始位置を取得。
 */
export const getListStartCh = (listText: string): number => {
  const originalLength = listText.length
  const trimmedLength = listText.trimStart().length
  const diff = originalLength - trimmedLength
  const text = listText.trimStart()
  if (isTaskList(text)) {
    if (isTaskChecked(text)) {
      return text.indexOf(' [x] ') + diff + 5
    }
    return text.indexOf(' [ ] ') + diff + 5
  }
  return text.indexOf(' ') + diff + 1
}

/**
 * リストの種別毎のプレフィックスを取得。
 */
export const getListPrefix = (type: string, number = 1): string => {
  if (type === LIST_TYPE.BULLET) {
    return '- '
  } else if (type === LIST_TYPE.ORDERED) {
    return `${number}. `
  } else if (type === LIST_TYPE.TASK) {
    return '- [ ] '
  }
  return ''
}

/**
 * リストの階層の深さを取得。
 */
export const getListDepth = (lineText: string): number => {
  const item = LIST_RE.exec(lineText)
  if (!item) {
    throw new Error('list format error')
  }
  return (item[1].match(/\t/g) || []).length
}

/**
 * リストの接頭語を置換。
 */
export const replaceListPrefix = (lineText: string, prefix: string): string => {
  const item = LIST_RE.exec(lineText)
  if (!item) {
    throw new Error('list format error')
  }
  return lineText.replace(LIST_RE, item[1] + prefix)
}

/**
 * 番号付きリストの番号を置換。
 */
export const replaceListNumber = (lineText: string, number: number): string => {
  if (!isOrderedList(lineText)) {
    return lineText
  }
  const prefix = `${number}. `
  return replaceListPrefix(lineText, prefix)
}

/**
 * テーブルを挿入します。
 */
export const getDefaultTable = (row = 3, column = 3): string => {
  let tr = '| '
  let dr = '| '
  for (let i = 0; i < column - 1; i++) {
    if (i === 0) {
      tr += '   '
      dr += '---'
    }
    tr += ' |    '
    dr += ' | ---'
  }
  tr += ' |\n'
  dr += ' |\n'

  let table = tr + dr
  for (let i = 0; i < row - 1; i++) {
    table += tr
  }
  return table
}

export const isTableRow = (lineText: string): boolean => {
  return !!lineText.match(/^\|/) && !!lineText.match(/\|$/)
}

export const getTableRow = (lineText: string): string[] => {
  return lineText.replace(/^\|/, '').replace(/\|$/, '').split('|')
}
