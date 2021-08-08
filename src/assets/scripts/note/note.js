import file from './file'

class Note extends file {
  constructor (path) {
    super(path)
    this.currentContent = this.fileContent || ''
    this.isSaved = this.checkSaved()
  }

  find (word) {
    const w = word.toLowerCase()
    const rows = this.currentContent.split('\n')
    return rows.filter((r) => r.toLowerCase().includes(w))
  }

  update (content) {
    this.currentContent = content
    this.isSaved = this.checkSaved()
  }

  save (path = this.filePath) {
    this.writeContent(this.currentContent, path)
    this.isSaved = this.checkSaved()
  }

  checkSaved () {
    return this.currentContent === this.fileContent
  }
}

export default Note
