/**
 * コードブロックか否か
 * @param text
 */
export const isCodeBlock = (text: string) => {
  return text === '```'
}

/**
 * コードブロックの定義文字を返却
 */
export const getDefaultCodeBlock = () => {
  return '```\n\n```'
}
