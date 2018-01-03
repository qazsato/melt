<template>
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
</template>

<script>
export default {
  props: ['editor'],
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
  }
}
</script>

<style scoped>
  #toolbar {
    height: 50px;
    background-color: #4a4a4a;
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
