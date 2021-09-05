/**
 * コードブロックか否か
 * @param text
 */
export const isCodeBlock = (text: string): boolean => {
  return text === '```'
}

/**
 * コードブロックの定義文字を返却
 */
export const getDefaultCodeBlock = (): string => {
  return '```\n\n```'
}
