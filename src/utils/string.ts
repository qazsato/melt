/**
 * マルチバイト文字を考慮した、文字列の長さを取得します。
 * @param str
 */
export const getCharWidth = (str: string): number => {
  let sbc = 0 // シングルバイト文字
  let mbc = 0 // マルチバイト文字
  for (let i = 0; i < str.length; i++) {
    if (new Blob([str[i]]).size > 1) {
      mbc++
    } else {
      sbc++
    }
  }
  // NOTE: Source Han Code JP は、半角3文字に対して全角2文字のため、全角を1.5倍している
  return sbc + mbc * 1.5
}
