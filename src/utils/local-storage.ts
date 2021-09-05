// 閲覧履歴
interface BrowsingHistory {
  path: string
  time: number
}

/**
 * 閲覧履歴を更新
 * @param path ファイルパス
 */
export const updateBrowsingHistory = (path: string): void => {
  if (!path) {
    return
  }
  const browsingHistories = localStorage.browsingHistories
    ? (JSON.parse(localStorage.browsingHistories) as BrowsingHistory[])
    : []
  const bh = browsingHistories.find((h: BrowsingHistory) => h.path === path)
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
export const getBrowsingHistories = (): string[] => {
  const MAX_NOTE_COUNT = 10
  if (!localStorage.browsingHistories) {
    return []
  }
  const browsingHistories = JSON.parse(localStorage.browsingHistories) as BrowsingHistory[]
  browsingHistories.sort((a: BrowsingHistory, b: BrowsingHistory) => b.time - a.time)
  const paths = browsingHistories.slice(0, MAX_NOTE_COUNT).map((h: BrowsingHistory) => h.path)
  return paths
}
