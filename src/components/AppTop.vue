<template>
  <div>
    <div id="editor"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    const editor = ace.edit('editor');
    editor.setFontSize(14);
    editor.getSession().setUseWrapMode(true);
    editor.getSession().setTabSize(2);
  }
}
</script>

<style scoped>
#editor {
  width: 100%;
  height: 500px;
}
</style>
