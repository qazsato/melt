import settings from '@config/settings.json';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import Note from './note.js';
import _ from 'lodash';

class NoteUtil {
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
  static readAllTags() {
    let tags = [];
    const files = fs.readdirSync(settings.directory);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const note = new Note(`${settings.directory}/${file}`);
      tags = tags.concat(note.readTag());
    }
    tags = tags.filter((element, index, array) => array.indexOf(element) === index);
    return tags;
  }
  static getRecentPath() {
    const files = fs.readdirSync(settings.directory);
    let recentPath = '';
    let recentTime = '';
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const note = new Note(`${settings.directory}/${file}`);
      const updatedAt = note.readUpdateTime();
      const path = note.readPath();
      if (!recentTime || moment(updatedAt).isAfter(recentTime)) {
        recentPath = path;
        recentTime = updatedAt;
      }
    }
    return recentPath;
  }
}

export default NoteUtil;
