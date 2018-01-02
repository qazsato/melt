<template>
  <div id="screen">
    <section id="toolbar">
      <button @click="insertLink">
        <i class="material-icons">insert_link</i>
      </button>
      <button @click="insertImage">
        <i class="material-icons">insert_photo</i>
      </button>
      <button @click="insertBold">
        <i class="material-icons">format_bold</i>
      </button>
      <button @click="insertItalic">
        <i class="material-icons">format_italic</i>
      </button>
      <button @click="insertStrikethrough">
        <i class="material-icons">format_strikethrough</i>
      </button>
      <button @click="insertQuote">
        <i class="material-icons">format_quote</i>
      </button>
      <button @click="insertCode">
        <i class="material-icons">code</i>
      </button>
      <button @click="insertBulleted">
        <i class="material-icons">format_list_bulleted</i>
      </button>
      <button @click="insertNumbered">
        <i class="material-icons">format_list_numbered</i>
      </button>
      <button @click="clickPublish">
        <i class="material-icons">publish</i>
      </button>
    </section>
    <main>
      <div id="editor"></div>
      <article id="preview" class="markdown-body"></article>
    </main>
  </div>
</template>

<script>
import 'github-markdown-css';
import 'highlight.js/styles/github.css';

import marked from 'marked';
marked.setOptions({
  highlight: (code) => {
    return require('highlight.js').highlightAuto(code).value;
  }
});

export default {
  data() {
    return {
      editor: null
    };
  },
  methods: {
    insertLink() {
      this.editor.insert(`[](${this.editor.getCopyText()})`);
      const pos = this.editor.getCursorPosition();
      this.editor.gotoLine(pos.row + 1, pos.column - 1);
      this.editor.focus();
    },
    insertImage() {
      this.editor.insert(`![](${this.editor.getCopyText()})`);
      const pos = this.editor.getCursorPosition();
      this.editor.gotoLine(pos.row + 1, pos.column - 1);
      this.editor.focus();
    },
    insertBold() {
      this.editor.insert(`**${this.editor.getCopyText()}**`);
      const pos = this.editor.getCursorPosition();
      this.editor.gotoLine(pos.row + 1, pos.column - 2);
      this.editor.focus();
    },
    insertItalic() {
      this.editor.insert(`_${this.editor.getCopyText()}_`);
      const pos = this.editor.getCursorPosition();
      this.editor.gotoLine(pos.row + 1, pos.column - 1);
      this.editor.focus();
    },
    insertStrikethrough() {
      this.editor.insert(`~~${this.editor.getCopyText()}~~`);
      const pos = this.editor.getCursorPosition();
      this.editor.gotoLine(pos.row + 1, pos.column - 2);
      this.editor.focus();
    },
    insertQuote() {
      this.editor.insert(`> ${this.editor.getCopyText()}`);
      this.editor.focus();
    },
    insertCode() {
      this.editor.insert(`\`${this.editor.getCopyText()}\``);
      const pos = this.editor.getCursorPosition();
      this.editor.gotoLine(pos.row + 1, pos.column - 1);
      this.editor.focus();
    },
    insertBulleted() {
      const pos = this.editor.getCursorPosition();
      this.editor.session.insert({row: pos.row, column: 0}, `* `);
      this.editor.focus();
    },
    insertNumbered() {
      const pos = this.editor.getCursorPosition();
      this.editor.session.insert({row: pos.row, column: 0}, `1. `);
      this.editor.focus();
    },
    clickPublish() {
      this.editor.focus();
    }
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
      const text = this.editor.getValue();
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
    background-color: #4a4a4a;
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
    margin: 8px;
  }

  button {
    margin: 5px 3px;
    padding: 0;
    border: none;
    color: #ddd;
    cursor: pointer;
    background: none;
    -webkit-appearance: none;
  }

  button:hover {
    color: #fff;
    background: #313131;
  }
</style>
