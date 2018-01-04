<template>
  <div class="editor-area">
    <div id="editor"></div>
  </div>
</template>

<script>
import Editor from '../scripts/MarkdownEditor';
export default {
  data() {
    return {
      editor: null
    };
  },
  mounted() {
    this.editor = new Editor('editor');
    this.editor.focus();
    this.editor.on('change', () => this.$emit('changeText', this.editor.getText()));
    this.$emit('mountEditor', this.editor);
  }
}
</script>

<style scoped>
  .editor-area {
    width: 100%;
    height: 100%;
    background-color: #fafafa;
  }

  #editor {
    margin: 15px;
    width: calc(100% - 30px);
    height: calc(100% - 30px);
    background-color: #fafafa;
  }
</style>
