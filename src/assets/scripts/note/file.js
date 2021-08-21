import fs from 'fs'

class File {
  constructor (path) {
    this.load(path)
  }

  load (path) {
    this.filePath = path
    this.fileName = path ? path.split('/').reverse()[0] : ''
    this.fileContent = this.readFile(path)
    this.fileStats = this.stat(path)
  }

  readFile (path) {
    if (!this.validatePath(path)) {
      return ''
    }
    return fs.readFileSync(path, 'utf-8')
  }

  stat (path) {
    if (!this.validatePath(path)) {
      return null
    }
    return fs.statSync(path)
  }

  writeFile (data, path) {
    fs.writeFileSync(path, data)
    this.load(path)
  }

  unlink () {
    fs.unlinkSync(this.filePath)
    this.load()
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
}

export default File
