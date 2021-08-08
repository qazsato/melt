import glob from 'glob'
import Note from './note.js'
import _ from 'lodash'

class NoteUtil {
  static readAllNotes (dir) {
    const files = glob.sync(`${dir}/**/*.md`)
    const notes = files.map((f) => new Note(f))
    return _.orderBy(notes, (n) => n.fileName, 'asc')
  }

  static readRecentlyOpenedNotes () {
    if (!localStorage.browsingHistories) {
      return []
    }
    const browsingHistories = JSON.parse(localStorage.browsingHistories)
    browsingHistories.sort((a, b) => b.time - a.time)
    const paths = browsingHistories.slice(0, 10).map((h) => h.path)
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
}

export default NoteUtil
