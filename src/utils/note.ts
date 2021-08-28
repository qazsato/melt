import glob from 'glob'
import _ from 'lodash'
import Note from '@/assets/scripts/note/note'
import { getBrowsingHistories } from '@/utils/local-storage'

/**
 * ディレクトリ配下の全てのノートを取得
 * @param {String} dir ディレクトリパス
 * @returns notes
 */
export const readAllNotes = (dir) => {
  const files = glob.sync(`${dir}/**/*.md`)
  const notes = files.map((f) => new Note(f))
  return _.orderBy(notes, (n) => n.fileStats.mtime, 'desc')
}

/**
 * 最近開いたノートを取得
 * @returns notes
 */
export const readRecentlyOpenedNotes = () => {
  const paths = getBrowsingHistories()
  const notes = []
  paths.forEach((p) => {
    try {
      notes.push(new Note(p))
    } catch (error) {
      // 削除済みのファイルの場合は何もしない
      console.warn(error)
    }
  })
  return notes
}
