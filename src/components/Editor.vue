<template>
  <div id="editor"></div>
</template>

<script>
export default {
  data() {
    return {
      editor: null
    };
  },
  mounted() {
    this.editor = ace.edit('editor');
    this.editor.setFontSize(14);
    this.editor.focus();
    this.editor.getSession().setUseWrapMode(true);
    this.editor.getSession().setTabSize(2);
    this.editor.setTheme('ace/theme/monokai');
    this.editor.getSession().setMode('ace/mode/markdown');
    this.editor.getSession().on('change', () => {
      this.$emit('changeText', this.editor.getValue());
    });
    this.$emit('mountEditor', this.editor);
  }
}
</script>

<style scoped>
  #editor {
    width: 100%;
    height: 100%;
  }
</style>
