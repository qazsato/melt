import file from './file'

class Note extends file {
  constructor (path) {
    super(path)
    this.content = this.fileContent || ''
    this.tableOfContents = this.createTableOfContents()
    this.isChanged = this.checkChanged()
  }

  get title () {
    return this.fileName || 'Untitled'
  }

  find (word) {
    const w = word.toLowerCase()
    const rows = this.content.split('\n')
    return rows.filter((r) => r.toLowerCase().includes(w))
  }

  update (content) {
    this.content = content
    this.tableOfContents = this.createTableOfContents()
    this.isChanged = this.checkChanged()
  }

  save (path = this.filePath) {
    if (!this.checkChanged()) return // 差分なし(=保存済み)の場合は何もしない
    this.writeFile(this.content, path)
    this.tableOfContents = this.createTableOfContents()
    this.isChanged = false
  }

  delete () {
    this.content = null
    this.tableOfContents = null
    this.isChanged = false
    this.unlink()
  }

  checkChanged () {
    return this.content !== this.fileContent
  }

  createTableOfContents () {
    const tocs = []
    const rows = this.content.split('\n')
    rows.forEach((r) => {
      if (r.indexOf('# ') === 0) {
        tocs.push({ heading: 1, text: r.replace('# ', '') })
      } else if (r.indexOf('## ') === 0) {
        tocs.push({ heading: 2, text: r.replace('## ', '') })
      } else if (r.indexOf('### ') === 0) {
        tocs.push({ heading: 3, text: r.replace('### ', '') })
      } else if (r.indexOf('#### ') === 0) {
        tocs.push({ heading: 4, text: r.replace('#### ', '') })
      } else if (r.indexOf('##### ') === 0) {
        tocs.push({ heading: 5, text: r.replace('##### ', '') })
      } else if (r.indexOf('###### ') === 0) {
        tocs.push({ heading: 6, text: r.replace('###### ', '') })
      }
    })
    return tocs
  }
}

export default Note
