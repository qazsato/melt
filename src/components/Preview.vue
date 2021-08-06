<template>
  <div
    v-show="isViewModePreview"
    class="preview-area"
  >
    <!-- eslint-disable vue/no-v-html -->
    <article
      class="markdown-body"
      v-html="markedText"
    />
    <!-- eslint-enable vue/no-v-html -->
  </div>
</template>

<script>
import Markdown from '@scripts/markdown/markdown.js';
import '@styles/markdown.scss';
import { VIEW_MODE } from '@constants/index.js'

export default {
  props: {
    text: {
      type: String,
      required: true
    }
  },
  computed: {
    isViewModePreview() {
      return this.$store.state.viewMode === VIEW_MODE.PREVIEW
    },

    markedText() {
      return this.markdown.render(this.text);
    }
  },
  created() {
    this.markdown = new Markdown();
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
