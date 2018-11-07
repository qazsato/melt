import settings from '../../../../config/settings.json';
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
}

export default Note;
