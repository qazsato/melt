import file from './file'
import Markdown from '@/assets/scripts/markdown/markdown'

class Note extends file {
  content = ''
  tableOfContents: tableOfContent[] = []
  isChanged = false

  constructor(path?: string) {
    super(path)
    this.content = this.fileContent || ''
    this.tableOfContents = this.createTableOfContents()
    this.isChanged = this.checkChanged()
  }

  get title(): string {
    return this.fileName || 'Untitled'
  }

  find(word: string): string[] {
    const w = word.toLowerCase()
    const rows = this.content.split('\n')
    return rows.filter((r) => r.toLowerCase().includes(w))
  }

  update(content: string): void {
    this.content = content
    this.tableOfContents = this.createTableOfContents()
    this.isChanged = this.checkChanged()
  }

  save(path = this.filePath): void {
    if (!this.checkChanged()) return // 差分なし(=保存済み)の場合は何もしない
    this.writeFile(this.content, path)
    this.tableOfContents = this.createTableOfContents()
    this.isChanged = false
  }

  delete(): void {
    this.content = ''
    this.tableOfContents = []
    this.isChanged = false
    this.unlink()
  }

  checkChanged(): boolean {
    return this.content !== this.fileContent
  }

  createTableOfContents(): tableOfContent[] {
    const tocs: tableOfContent[] = []
    const htmlText = new Markdown().render(this.content)
    const rows = htmlText.split('\n')
    rows.forEach((r) => {
      if (r.indexOf('<h1>') === 0) {
        tocs.push({
          heading: 1,
          text: r.replace('<h1>', '').replace('</h1>', ''),
        })
      } else if (r.indexOf('<h2>') === 0) {
        tocs.push({
          heading: 2,
          text: r.replace('<h2>', '').replace('</h2>', ''),
        })
      } else if (r.indexOf('<h3>') === 0) {
        tocs.push({
          heading: 3,
          text: r.replace('<h3>', '').replace('</h3>', ''),
        })
      } else if (r.indexOf('<h4>') === 0) {
        tocs.push({
          heading: 4,
          text: r.replace('<h4>', '').replace('</h4>', ''),
        })
      } else if (r.indexOf('<h5>') === 0) {
        tocs.push({
          heading: 5,
          text: r.replace('<h5>', '').replace('</h5>', ''),
        })
      } else if (r.indexOf('<h6>') === 0) {
        tocs.push({
          heading: 6,
          text: r.replace('<h6>', '').replace('</h6>', ''),
        })
      }
    })
    return tocs
  }
}

interface tableOfContent {
  heading: number
  text: string
}

export default Note
