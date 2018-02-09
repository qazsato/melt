
const settings = require('../../../config/settings.json');
const fs = require('fs');

class Note {
  static create() {
    const now = new Date();
    const file = `${settings.directory}/${now.toISOString()}.json`;
    const data = {
      createdAt: now.toISOString(),
      updatedAt: '',
      title: '',
      content: '',
      tags: []
    };
    fs.writeFileSync(file, JSON.stringify(data));
  }
  static readTag(file) {
    const text = fs.readFileSync(file, 'utf-8');
    return JSON.parse(text).tags;
  }
  static readContent(file) {
    const text = fs.readFileSync(file, 'utf-8');
    return JSON.parse(text).content;
  }
  static registTag(file, tag) {
    const now = new Date();
    const text = fs.readFileSync(file, 'utf-8');
    const data = JSON.parse(text);
    data.tags.push(tag);
    data.updatedAt = now.toISOString();
    fs.writeFileSync(file, JSON.stringify(data));
  }
  static removeTag(file, tag) {
    const now = new Date();
    const text = fs.readFileSync(file, 'utf-8');
    const data = JSON.parse(text);
    data.tags.splice(data.tags.indexOf(tag), 1);
    data.updatedAt = now.toISOString();
    fs.writeFileSync(file, JSON.stringify(data));
  }
  static updateContent(file, content) {
    const now = new Date();
    const text = fs.readFileSync(file, 'utf-8');
    const data = JSON.parse(text);
    data.content = content;
    data.updatedAt = now.toISOString();
    fs.writeFileSync(file, JSON.stringify(data));
  }
  static delete() {

  }
}

module.exports = Note;
