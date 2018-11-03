import settings from '../../../config/settings.json';
import fs from 'fs';
import moment from 'moment';
import AbstractNote from './abstract-note';

class Note extends AbstractNote {
  constructor(path) {
    super();
    if (path) {
      this.path = path;
      this.data = this.readFile(this.path);
    } else {
      this.path = `${settings.directory}/${new Date().toISOString()}.json`;
      this.data = this.createFile(this.path, this.createEmptyData());
    }
  }
  createEmptyData() {
    return {
      createdAt: '',
      updatedAt: '',
      title: '',
      content: '',
      tags: []
    }
  }
  delete() {
    this.deleteFile(this.path);
  }
  readPath() {
    return this.path;
  }
  readTag() {
    return this.data.tags;
  }
  readTitle() {
    return this.data.title;
  }
  readContent() {
    return this.data.content;
  }
  readUpdateTime() {
    return this.data.updatedAt;
  }
  registTag(tag) {
    this.data.tags.push(tag);
    this.data = this.updateFile(this.path, this.data);
  }
  removeTag(tag) {
    this.data.tags.splice(this.data.tags.indexOf(tag), 1);
    this.data = this.updateFile(this.path, this.data);
  }
  updateTitle(title) {
    this.data.title = title;
    this.data = this.updateFile(this.path, this.data);
  }
  updateContent(content) {
    this.data.content = content;
    this.data = this.updateFile(this.path, this.data);
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

export default Note;
