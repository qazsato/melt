import MarkdownIt from 'markdown-it'
import emoji from 'markdown-it-emoji'
import checkbox from 'markdown-it-task-checkbox'
import mermaid from '@liradb2000/markdown-it-mermaid'
import highlight from 'highlight.js'
import { alertPlugin } from 'markdown-it-github-alert'

class Markdown {
  md: MarkdownIt

  constructor() {
    this.md = new MarkdownIt({
      html: true,
      breaks: true,
      linkify: true,
      highlight: (str, lang) => {
        let code = ''
        if (lang && highlight.getLanguage(lang)) {
          code = highlight.highlight(str, {
            language: lang,
            ignoreIllegals: true,
          }).value
        } else {
          code = this.md.utils.escapeHtml(str)
        }
        return '<pre class="codeblock"><i class="clipboard"></i><div><code>' + code + '</code></div></pre>'
      },
    })
    this.md.use(emoji)
    this.md.use(checkbox, { disabled: true })
    this.md.use(mermaid)
    this.md.use(alertPlugin)
    this.changeLinkOpenRule()
  }

  render(text: string): string {
    return this.md.render(text)
  }

  changeLinkOpenRule(): void {
    // NOTE 全てのaタグにtarget="_blank"を付与する。
    // 参考) https://github.com/markdown-it/markdown-it/blob/0e51825a5cd912121d733938ef2603833378888a/docs/architecture.md#renderer
    // Remember old renderer, if overriden, or proxy to default renderer
    const defaultRender =
      this.md.renderer.rules.link_open ||
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options)
      }

    this.md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      // If you are sure other plugins can't add `target` - drop check below
      const aIndex = tokens[idx].attrIndex('target')

      if (aIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']) // add new attribute
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        tokens[idx].attrs![aIndex][1] = '_blank' // replace value of existing attr
      }

      // pass token to default renderer.
      return defaultRender(tokens, idx, options, env, self)
    }
  }
}

export default Markdown
