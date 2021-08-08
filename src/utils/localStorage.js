/**
 * 閲覧履歴を更新
 * @param {String} path ファイルパス
 */
export const updateBrowsingHistory = (path) => {
  const browsingHistories = localStorage.browsingHistories ? JSON.parse(localStorage.browsingHistories) : []
  const bh = browsingHistories.find((h) => h.path === path)
  const time = new Date().getTime()
  if (bh) {
    bh.time = time
  } else {
    browsingHistories.push({ path, time })
  }
  localStorage.browsingHistories = JSON.stringify(browsingHistories)
}

/**
 * 閲覧履歴を取得
 * @returns ファイルパス
 */
export const getBrowsingHistories = () => {
  const MAX_NOTE_COUNT = 10
  if (!localStorage.browsingHistories) {
    return []
  }
  const browsingHistories = JSON.parse(localStorage.browsingHistories)
  browsingHistories.sort((a, b) => b.time - a.time)
  const paths = browsingHistories.slice(0, MAX_NOTE_COUNT).map((h) => h.path)
  return paths
}