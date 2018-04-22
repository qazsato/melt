const fs = require('fs');
const path = require('path');
const Note = require('./Note');
const _ = require('lodash');

class FileUtil {
  static readTree(dir) {
    const results = [];
    const files = fs.readdirSync(dir);
    let notes = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const p = path.join(dir, file);
        const note = new Note(p);
        notes.push(note);
      }
    }
    notes = _.orderBy(notes, (note) => note.data.updatedAt, 'desc');
    for (const note of notes) {
      results.push({
        label: note.readTitle() || 'Untitled',
        path: note.readPath()
      });
    }
    return results;
  }
}

module.exports = FileUtil;
