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
    const renderer = new marked.Renderer();
    renderer.link = (href, title, text) => `<a target="_blank" href="${href}" title="${title}">${text}</a>`;
    marked.setOptions({
      renderer,
      highlight: (code) => {
        return highlight.highlightAuto(code).value;
      }
    });
  },
  computed: {
    markedText() {
      let text = emoji.emojify(this.text);
      text = text.replace(/\[x\]/gi, '<input type="checkbox" disabled checked>');
      text = text.replace(/\[ \]/gi, '<input type="checkbox" disabled>');
      return marked(text);
    }
  }
}
</script>

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
