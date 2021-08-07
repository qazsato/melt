import glob from 'glob';
import Note from './note.js';
import _ from 'lodash';

class NoteUtil {
  static readAllNotes(dir) {
    const files = glob.sync(`${dir}/**/*.md`)
    const notes = files.map((f) => new Note(f))
    return _.orderBy(notes, (n) => n.readTitle(), 'asc');
  }

  static readRecentlyOpenedNotes() {
    if (!localStorage.browsingHistories) {
      return []
    }
    const browsingHistories = JSON.parse(localStorage.browsingHistories)
    browsingHistories.sort((a, b) => b.time - a.time)
    const files = browsingHistories.slice(0, 10).map((h) => h.file)
    const notes = []
    files.forEach((f) => {
      try {
        notes.push(new Note(f))
      } catch (error) {
        // 削除済みのファイルの場合は何もしない
        console.warn(error)
      }
    })
    return notes
  }
}

export default NoteUtil;
