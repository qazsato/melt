import setting from '@config/setting.json';
import glob from 'glob';
import Note from './note.js';
import _ from 'lodash';

class NoteUtil {
  static readAllNotes(dir) {
    const files = glob.sync(`${dir}/**/*.md`)
    const notes = files.map((f) => new Note(f))
    return _.orderBy(notes, (n) => n.readTitle(), 'asc');
  }
}

export default NoteUtil;
