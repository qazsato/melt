import fs from 'fs';

class AbstractNote {
  createFile(path, data) {
    const date = new Date().toISOString();
    data.createdAt = date;
    data.updatedAt = date;
    fs.writeFileSync(path, JSON.stringify(data));
    return data;
  }
  readFile(path) {
    const str = fs.readFileSync(path, 'utf-8');
    const data = JSON.parse(str);
    return data;
  }
  updateFile(path, data) {
    const date = new Date().toISOString();
    data.updatedAt = date;
    fs.writeFileSync(path, JSON.stringify(data));
    return data;
  }
  deleteFile(path) {
    fs.unlinkSync(path);
    return {};
  }
}

export default AbstractNote;
