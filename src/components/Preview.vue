<template>
  <div class="preview-area" v-show="this.$store.state.mode === 'preview' || this.$store.state.mode === 'multi'">
    <article class="markdown-body" v-html="markedText"></article>
    <publish-button></publish-button>
  </div>
</template>

<script>
import Markdown from '../assets/scripts/markdown.js';
import publishButton from './PublishButton.vue';
import '../assets/styles/markdown.scss';

export default {
  props: ['text'],
  components: {
    publishButton
  },
  created() {
    this.markdown = new Markdown();
  },
  computed: {
    markedText() {
      return this.markdown.render(this.text);
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
    border-left: 1px solid #ebeef5;
  }

  .markdown-body {
    padding: 15px 30px;
  }
</style>
