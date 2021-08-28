import fs, { Stats } from 'fs'

class File {
  filePath: string = ''
  fileName: string = ''
  fileContent: string = ''
  fileStats: Stats = null

  constructor (path) {
    this.load(path)
  }

  load (path = null) {
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

  rename (path) {
    if (this.isExist(path)) {
      throw new Error('file path is exists.')
    }
    fs.renameSync(this.filePath, path)
    this.load(path)
  }

  isExist (path) {
    try {
      this.stat(path)
      return true
    } catch (e) {
      return false
    }
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
