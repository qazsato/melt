import setting from '@config/setting.json';
import glob from 'glob';
import Note from './note.js';
import _ from 'lodash';

class NoteUtil {
  static readTree(dir) {
    const files = glob.sync(`${dir}/**/*.md`)
    let notes = files.map((f) => new Note(f))
    notes = _.orderBy(notes, (n) => n.readTitle(), 'asc');
    return notes.map((n) => {
      const path = n.readPath()
      return {
        label: n.readTitle() || 'Untitled',
        path: path,
        relativePath: path.split(setting.directory)[1]
      }
    })
  }

  static readAllNotes(dir) {
    const files = glob.sync(`${dir}/**/*.md`)
    const notes = files.map((f) => new Note(f))
    return _.orderBy(notes, (n) => n.readTitle(), 'asc');
  }
}

export default NoteUtil;
