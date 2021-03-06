import MarkdownIt from 'markdown-it';
import emoji from 'markdown-it-emoji';
import katex from 'markdown-it-katex';
import plantuml from 'markdown-it-plantuml';
import footnote from 'markdown-it-footnote';
import checkbox from 'markdown-it-task-checkbox';
import highlight from 'highlight.js';

class Markdown {
  constructor() {
    this.md = new MarkdownIt({
      html: true,
      breaks: true,
      linkify: true,
      highlight: (code, lang) => {
        if (lang) {
          return highlight.highlightAuto(code, [lang]).value;
        }
        return code;
      }
    });
    this.md.use(emoji);
    this.md.use(katex);
    this.md.use(plantuml);
    this.md.use(footnote);
    this.md.use(checkbox, {disabled: true});
    this.changeLinkOpenRule();
  }
  render(text) {
    return this.md.render(text);
  }
  changeLinkOpenRule() {
    // NOTE 全てのaタグにtarget="_blank"を付与する。
    // 参考) https://github.com/markdown-it/markdown-it/blob/0e51825a5cd912121d733938ef2603833378888a/docs/architecture.md#renderer
    // Remember old renderer, if overriden, or proxy to default renderer
    const defaultRender = this.md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

    this.md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      // If you are sure other plugins can't add `target` - drop check below
      const aIndex = tokens[idx].attrIndex('target');

      if (aIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']); // add new attribute
      } else {
        tokens[idx].attrs[aIndex][1] = '_blank';    // replace value of existing attr
      }

      // pass token to default renderer.
      return defaultRender(tokens, idx, options, env, self);
    };
  }
}

export default Markdown;
