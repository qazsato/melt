import fs from 'fs'
class Note {
  constructor(path) {
    this.path = path;
    this.data = fs.readFileSync(this.path, 'utf-8')
  }

  delete() {
    fs.unlinkSync(this.path);
  }

  readPath() {
    return this.path;
  }

  readTitle() {
    return this.path.split('/').reverse()[0]
  }

  readContent() {
    return this.data;
  }

  updateContent(content) {
    this.data = content;
    fs.writeFileSync(this.path, this.data);
  }
}

export default Note;
