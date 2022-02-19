/**
 * マルチバイト文字を考慮した、文字列の長さを取得します。
 * @param str
 */
export const getCharWidth = (str: string): number => {
  let sbc = 0 // シングルバイト文字
  let mbc = 0 // マルチバイト文字
  for (let i = 0; i < str.length; i++) {
    // NOTE: 半角スペースからチルダまでが、半角英数字と記号が定義された範囲となるため、その範囲内の場合シングルバイト文字と判断。
    // https://www-creators.com/archives/5187
    if (str[i].match(/[ -~]/)) {
      sbc++
    } else {
      mbc++
    }
  }
  // NOTE: Source Han Code JP は、半角3文字に対して全角2文字のため、全角を1.5倍している
  return sbc + mbc * 1.5
}
