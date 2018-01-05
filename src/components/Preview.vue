<template>
  <div class="preview-area" v-show="visible">
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
  props: ['text', 'visible'],
  components: {
    publishButton
  },
  mounted() {
    marked.setOptions({
      highlight: (code) => {
        return highlight.highlightAuto(code).value;
      }
    });
  },
  computed: {
    markedText() {
      const text = emoji.emojify(this.text);
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
