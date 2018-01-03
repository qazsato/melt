<template>
  <article id="preview">
    <div v-html="markedText" class="markdown-body"></div>
  </article>
</template>

<script>
import marked from 'marked';
import highlight from 'highlight.js';
import 'highlight.js/styles/github.css';
import 'github-markdown-css';

export default {
  props: ['text'],
  mounted() {
    marked.setOptions({
      highlight: (code) => {
        return highlight.highlightAuto(code).value;
      }
    });
  },
  computed: {
    markedText() {
      return marked(this.text);
    }
  }
}
</script>

<style scoped>
  #preview {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
  }

  .markdown-body {
    padding: 15px 30px;
  }
</style>
