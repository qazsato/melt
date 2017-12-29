<template>
  <div id="screen">
    <section id="toolbar">
      <i class="material-icons">insert_link</i>
      <i class="material-icons">insert_photo</i>
      <i class="material-icons">format_bold</i>
      <i class="material-icons">format_italic</i>
      <i class="material-icons">format_quote</i>
      <i class="material-icons">code</i>
      <i class="material-icons">format_list_bulleted</i>
      <i class="material-icons">format_list_numbered</i>
      <i class="material-icons">publish</i>
    </section>
    <main>
      <div id="editor"></div>
      <article id="preview" class="markdown-body"></article>
    </main>
  </div>
</template>

<script>
import 'github-markdown-css';
import marked from 'marked';

export default {
  mounted() {
    const editor = ace.edit('editor');
    editor.setFontSize(14);
    editor.focus();
    editor.getSession().setUseWrapMode(true);
    editor.getSession().setTabSize(2);
    editor.getSession().on('change', () => {
      const text = editor.getValue();
      document.getElementById('preview').innerHTML = marked(text);
    });
  }
}
</script>

<style>
  html {
    height: 100%;
  }
  body {
    height: 100%;
    margin: 0;
  }
  #app {
    height: 100%;
  }
</style>

<style scoped>
  #screen {
    height: 100%;
  }

  #toolbar {
    height: 50px;
  }

  main {
    display: flex;
    height: calc(100% - 50px);
  }

  #editor,
  #preview {
    height: 100%;
    width: 50%;
  }

  #preview {
    overflow-y: scroll;
  }

  .material-icons {
    margin: 10px;
  }
</style>
