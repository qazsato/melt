import file from './file'

class Note extends file {
  constructor (path) {
    super(path)
    this.title = this.fileName || 'Untitled'
    this.content = this.fileContent || ''
    this.isSaved = this.checkSaved()
  }

  find (word) {
    const w = word.toLowerCase()
    const rows = this.content.split('\n')
    return rows.filter((r) => r.toLowerCase().includes(w))
  }

  update (content) {
    this.content = content
    this.isSaved = this.checkSaved()
  }

  save (path = this.filePath) {
    this.writeContent(this.content, path)
    this.title = this.fileName
    this.isSaved = true
  }

  checkSaved () {
    return this.content === this.fileContent
  }
}

export default Note
