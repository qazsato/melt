const settings = require('../../../config/settings.json');
const fs = require('fs');
const moment = require('moment');

class Note {
  constructor(path) {
    if (path) {
      this.path = path;
      this.read();
    } else {
      this.path = `${settings.directory}/${new Date().toISOString()}.json`;
      this.create();
    }
  }
  create() {
    this.data = this.createEmptyData();
    this.data.createdAt = new Date().toISOString();
    this.data.updatedAt = new Date().toISOString();
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
  read() {
    const f = fs.readFileSync(this.path, 'utf-8');
    this.data = JSON.parse(f);
  }
  update() {
    this.data.updatedAt = new Date().toISOString();
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
  delete() {
    // TODO
    this.data = {};
    fs.unlinkSync(this.path);
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
    this.update();
  }
  removeTag(tag) {
    this.data.tags.splice(this.data.tags.indexOf(tag), 1);
    this.update();
  }
  updateTitle(title) {
    this.data.title = title;
    this.update();
  }
  updateContent(content) {
    this.data.content = content;
    this.update();
  }
  static readAllTags() {
    let tags = [];
    const files = fs.readdirSync(settings.directory);
    for (const file of files) {
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

module.exports = Note;
