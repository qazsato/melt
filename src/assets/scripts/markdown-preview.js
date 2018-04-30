const MarkdownIt = require('markdown-it');
const emoji = require('markdown-it-emoji');
const katex = require('markdown-it-katex');
const footnote = require('markdown-it-footnote');
const checkbox = require('markdown-it-task-checkbox');
const highlight = require('highlight.js');

class MarkdownPreview {
  constructor() {
    this.md = new MarkdownIt({
      html: true,
      highlight: (code, lang) => {
        if (lang) {
          return highlight.highlightAuto(code, [lang]).value;
        }
        return code;
      }
    });
    this.md.use(emoji);
    this.md.use(katex);
    this.md.use(footnote);
    this.md.use(checkbox, {disabled: true});

    // NOTE 全てのaタグにtarget="_blank"を付与する
    // https://github.com/markdown-it/markdown-it/blob/0e51825a5cd912121d733938ef2603833378888a/docs/architecture.md#renderer
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
  render(text) {
    return this.md.render(text);
  }
}

module.exports = MarkdownPreview;
