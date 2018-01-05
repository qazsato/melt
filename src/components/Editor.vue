<template>
  <div class="editor-area">
    <textarea id="editor"></textarea>
  </div>
</template>

<script>
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/base16-light.css';
import '../styles/MarkdownEditor.css';
import 'codemirror/mode/gfm/gfm.js';
import Editor from '../scripts/MarkdownEditor';
export default {
  data() {
    return {
      editor: null
    };
  },
  mounted() {
    this.editor = new Editor('editor');
    this.editor.on('change', () => this.$emit('changeText', this.editor.getText()));
    this.$emit('mountEditor', this.editor);
  }
}
</script>

<style scoped>
  .editor-area {
    flex: 1;
    min-width: 50%;
    height: 100%;
    background-color: #fafafa;
  }

  #editor {
    width: 100%;
    height: 100%;
    background-color: #fafafa;
  }
</style>
