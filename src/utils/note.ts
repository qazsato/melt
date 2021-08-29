import glob from 'glob'
import _ from 'lodash'
import Note from '@/assets/scripts/note/note'
import { getBrowsingHistories } from '@/utils/local-storage'

/**
 * ディレクトリ配下の全てのノートを取得
 * @param {String} dir ディレクトリパス
 * @returns notes
 */
export const readAllNotes = (dir: string): Note[] => {
  const paths = glob.sync(`${dir}/**/*.md`)
  const notes = paths.map((p: string) => new Note(p))
  return _.orderBy(notes, (n: Note) => n.fileStats?.mtime, 'desc')
}

/**
 * 最近開いたノートを取得
 * @returns notes
 */
export const readRecentlyOpenedNotes = (): Note[] => {
  const paths = getBrowsingHistories()
  const notes: Note[] = []
  paths.forEach((p: string) => {
    try {
      notes.push(new Note(p))
    } catch (error) {
      // 削除済みのファイルの場合は何もしない
      console.warn(error)
    }
  })
  return notes
}
