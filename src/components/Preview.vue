<template>
  <div class="preview-area" v-show="this.$store.state.mode === 'preview' || this.$store.state.mode === 'multi'">
    <article class="markdown-body" v-html="markedText"></article>
    <publish-button></publish-button>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';
import emoji from 'markdown-it-emoji';
import checkbox from 'markdown-it-task-checkbox';
import highlight from 'highlight.js';
import 'highlight.js/styles/github.css';
import 'github-markdown-css';
import publishButton from './PublishButton.vue';

export default {
  props: ['text'],
  components: {
    publishButton
  },
  created() {
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


  },
  computed: {
    markedText() {
      return this.md.render(this.text);
    }
  }
}
</script>

<style>
  .markdown-body .task-list-item input {
    margin: 0 0.2em 0.25em -1.4em;
  }
</style>

<style scoped>
  .preview-area {
    flex: 1;
    min-width: 50%;
    height: 100%;
    overflow-y: scroll;
    border-left: 1px solid #ebeef5;
  }

  .markdown-body {
    padding: 15px 30px;
  }
</style>
