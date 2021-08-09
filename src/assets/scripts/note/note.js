import file from './file'

class Note extends file {
  constructor (path) {
    super(path)
    this.title = this.fileName || 'Untitled'
    this.content = this.fileContent || ''
    this.tableOfContents = this.createTableOfContents()
    this.isSaved = this.checkSaved()
  }

  find (word) {
    const w = word.toLowerCase()
    const rows = this.content.split('\n')
    return rows.filter((r) => r.toLowerCase().includes(w))
  }

  update (content) {
    this.content = content
    this.tableOfContents = this.createTableOfContents()
    this.isSaved = this.checkSaved()
  }

  save (path = this.filePath) {
    this.writeContent(this.content, path)
    this.title = this.fileName
    this.tableOfContents = this.createTableOfContents()
    this.isSaved = true
  }

  checkSaved () {
    return this.content === this.fileContent
  }

  createTableOfContents () {
    const tocs = []
    const rows = this.content.split('\n')
    rows.forEach((r) => {
      if (r.indexOf('# ') === 0) {
        tocs.push({ heading: 1, text: r.split('# ')[1] })
      } else if (r.indexOf('## ') === 0) {
        tocs.push({ heading: 2, text: r.split('## ')[1] })
      } else if (r.indexOf('### ') === 0) {
        tocs.push({ heading: 3, text: r.split('### ')[1] })
      } else if (r.indexOf('#### ') === 0) {
        tocs.push({ heading: 4, text: r.split('#### ')[1] })
      } else if (r.indexOf('##### ') === 0) {
        tocs.push({ heading: 5, text: r.split('##### ')[1] })
      } else if (r.indexOf('###### ') === 0) {
        tocs.push({ heading: 6, text: r.split('###### ')[1] })
      }
    })
    return tocs
  }
}

export default Note
