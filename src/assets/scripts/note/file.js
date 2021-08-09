import fs from 'fs'

class File {
  constructor (path) {
    this.filePath = path
    this.fileName = path ? path.split('/').reverse()[0] : ''
    this.fileContent = this.readContent(path)
    this.fileStats = this.readStats(path)
  }

  readContent (path) {
    if (!this.validatePath(path)) {
      return ''
    }
    return fs.readFileSync(path, 'utf-8')
  }

  readStats (path) {
    if (!this.validatePath(path)) {
      return null
    }
    return fs.statSync(path)
  }

  validatePath (path) {
    if (!path) {
      return false
    }
    const filExt = this.fileName.split('.').reverse()[0]
    if (filExt !== 'md') {
      throw new Error('file extension must be md.')
    }
    return true
  }

  writeContent (content, path = this.filePath) {
    fs.writeFileSync(path, content)
    this.reload(path)
  }

  reload (path) {
    this.filePath = path
    this.fileName = path.split('/').reverse()[0]
    this.fileContent = this.readContent(path)
    this.fileStats = this.readStats(path)
  }
}

export default File
