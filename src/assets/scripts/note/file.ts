import fs, { Stats } from 'fs'
import { updateBrowsingHistory, deleteBrowsingHistory } from '@/utils/local-storage'

class File {
  filePath = ''
  fileName = ''
  fileContent = ''
  fileStats: Stats | null = null

  constructor(path: string | undefined) {
    this.load(path)
  }

  load(path?: string | undefined): void {
    this.filePath = path || ''
    this.fileName = path ? path.split('/').reverse()[0] : ''
    this.fileContent = this.readFile(path)
    this.fileStats = this.stat(path)
  }

  readFile(path: string | undefined = ''): string {
    if (!this.validatePath(path)) {
      return ''
    }
    return fs.readFileSync(path, 'utf-8')
  }

  stat(path: string | undefined = ''): Stats | null {
    if (!this.validatePath(path)) {
      return null
    }
    return fs.statSync(path)
  }

  writeFile(data: string, path: string): void {
    fs.writeFileSync(path, data)
    this.load(path)
  }

  unlink(): void {
    fs.unlinkSync(this.filePath)
    deleteBrowsingHistory(this.filePath)
    this.load()
  }

  rename(path: string): void {
    if (this.isExist(path)) {
      throw new Error('file path is exists.')
    }
    fs.renameSync(this.filePath, path)
    deleteBrowsingHistory(this.filePath)
    updateBrowsingHistory(path)
    this.load(path)
  }

  isExist(path: string): boolean {
    try {
      const fileName = path.split('/').reverse()[0]
      const filePath = path.replace(fileName, '')
      const fileNames = fs.readdirSync(filePath)
      return fileNames.some((f) => f === fileName)
    } catch (e) {
      return false
    }
  }

  validatePath(path: string | undefined): boolean {
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
