<template>
  <div class="preview-area" v-show="this.$store.state.mode === 'preview' || this.$store.state.mode === 'multi'">
    <article class="markdown-body" v-html="markedText"></article>
    <publish-button></publish-button>
  </div>
</template>

<script>
import marked from 'marked';
import emoji from 'node-emoji';
import highlight from 'highlight.js';
import 'highlight.js/styles/github.css';
import 'github-markdown-css';
import publishButton from './PublishButton.vue';

export default {
  props: ['text'],
  components: {
    publishButton
  },
  mounted() {
    marked.setOptions({
      renderer: this.createRenderer(),
      highlight: (code, lang) => {
        if (lang) {
          return highlight.highlightAuto(code, [lang]).value;
        }
        return code;
      }
    });
  },
  computed: {
    markedText() {
      return marked(this.text);
    }
  },
  methods: {
    createRenderer() {
      const renderer = new marked.Renderer();
      renderer.list = (body, ordered) => {
        // GFMのCheckbox記法に対応するため拡張
        let html;
        if (ordered === true) {
          html = `<ol>${body}</ol>`;
        } else if (body.includes('type="checkbox"')) {
          html = `<ul class="check-list">${body}</ul>`
        } else {
          html = `<ul>${body}</ul>`;
        }
        return html;
      };
      renderer.listitem = (text) => {
        // GFMのCheckbox記法に対応するため拡張
        text = text.replace(/\[x\]/gi, '<input type="checkbox" disabled checked>');
        text = text.replace(/\[ \]/gi, '<input type="checkbox" disabled>');
        return `<li>${text}</li>`;
      };
      renderer.text = (html) => {
        // 絵文字に対応するため拡張
        return emoji.emojify(html);
      };
      renderer.link = (href, title, text) => {
        // 新規タブでブラウザ起動するため拡張
        return `<a target="_blank" href="${href}" title="${title}">${text}</a>`
      };
      return renderer;
    }
  }
}
</script>

<style>
  .markdown-body .check-list {
    list-style: none;
  }

  .markdown-body .check-list input[type="checkbox"] {
    margin-left: -2em;
  }
</style>

<style scoped>
  .preview-area {
    flex: 1;
    min-width: 50%;
    height: 100%;
    overflow-y: scroll;
  }

  .markdown-body {
    padding: 15px 30px;
  }
</style>
