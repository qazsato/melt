/**
 * コードブロックか否か
 * @param {string} text
 */
export const isCodeBlock = (text) => {
  return text === '```'
}

/**
 * コードブロックの定義文字を返却
 */
export const getDefaultCodeBlock = () => {
  return '```\n\n```'
}
