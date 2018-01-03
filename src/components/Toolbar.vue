<template>
  <section id="toolbar">
    <button @click="insertLink">
      <i class="icon-link"></i>
    </button>
    <button @click="insertImage">
      <i class="icon-photo"></i>
    </button>
    <button @click="insertBold">
      <i class="icon-bold"></i>
    </button>
    <button @click="insertItalic">
      <i class="icon-italic"></i>
    </button>
    <button @click="insertStrikethrough">
      <i class="icon-strikethrough"></i>
    </button>
    <button @click="insertQuote">
      <i class="icon-quote"></i>
    </button>
    <button @click="insertCode">
      <i class="icon-code"></i>
    </button>
    <button @click="insertBulleted">
      <i class="icon-list_bulleted"></i>
    </button>
    <button @click="insertNumbered">
      <i class="icon-list_numbered"></i>
    </button>
  </section>
</template>

<script>
export default {
  props: ['editor'],
  methods: {
    insertLink() {
      this.editor.insert(`[](${this.editor.getCopyText()})`);
      this.editor.moveCursorPosition(-1, 0);
      this.editor.focus();
    },
    insertImage() {
      this.editor.insert(`![](${this.editor.getCopyText()})`);
      this.editor.moveCursorPosition(-1, 0);
      this.editor.focus();
    },
    insertBold() {
      this.editor.insert(`**${this.editor.getCopyText()}**`);
      this.editor.moveCursorPosition(-2, 0);
      this.editor.focus();
    },
    insertItalic() {
      this.editor.insert(`_${this.editor.getCopyText()}_`);
      this.editor.moveCursorPosition(-1, 0);
      this.editor.focus();
    },
    insertStrikethrough() {
      this.editor.insert(`~~${this.editor.getCopyText()}~~`);
      this.editor.moveCursorPosition(-2, 0);
      this.editor.focus();
    },
    insertQuote() {
      this.editor.insert(`> ${this.editor.getCopyText()}`);
      this.editor.focus();
    },
    insertCode() {
      this.editor.insert(`\`${this.editor.getCopyText()}\``);
      this.editor.moveCursorPosition(-1, 0);
      this.editor.focus();
    },
    insertBulleted() {
      this.editor.insertPrefix(`- `);
      this.editor.focus();
    },
    insertNumbered() {
      this.editor.insertPrefix(`1. `);
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

  [class^="icon-"],
  [class*=" icon-"] {
    display: inline-block;
    margin: 8px;
    font-size: 24px;
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
