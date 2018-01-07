<template>
  <section id="toolbar">
    <el-tooltip content="Hyperlink (⌘K)" :open-delay="500">
      <button @click="insertLink">
        <i class="icon-link"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Image (⌘G)" :open-delay="500">
      <button @click="insertImage">
        <i class="icon-photo"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Bold (⌘B)" :open-delay="500">
      <button @click="insertBold">
        <i class="icon-bold"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Italic (⌘I)" :open-delay="500">
      <button @click="insertItalic">
        <i class="icon-italic"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Strikethrough (⌘+Shift+X)" :open-delay="500">
      <button @click="insertStrikethrough">
        <i class="icon-strikethrough"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Code (⌘+K)" :open-delay="500">
      <button @click="insertCode">
        <i class="icon-code"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Quote (⌘+I)" :open-delay="500">
      <button @click="insertQuote">
        <i class="icon-quote"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Bulleted List (⌘+O)" :open-delay="500">
      <button @click="insertListBulleted">
        <i class="icon-list_bulleted"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Numbered List (⌘+U)" :open-delay="500">
      <button @click="insertListNumbered">
        <i class="icon-list_numbered"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Checked List (⌘+Y)" :open-delay="500">
      <button @click="insertListChecked">
        <i class="icon-list_checked"></i>
      </button>
    </el-tooltip>
    <el-radio-group @change="changeViewMode" v-model="viewMode" size="mini" fill="#00b1b3" class="checkbox-mode">
      <el-radio-button label="multi">A</el-radio-button>
      <el-radio-button label="editor">B</el-radio-button>
      <el-radio-button label="preview">C</el-radio-button>
    </el-radio-group>
  </section>
</template>

<script>
export default {
  props: ['editor'],
  data() {
    return {
      viewMode: 'multi'
    };
  },
  methods: {
    insertLink() {
      this.editor.insert(`[](${this.editor.getSelection()})`);
      this.editor.moveCursorPosition(-1, 0);
      this.editor.focus();
    },
    insertImage() {
      this.editor.insert(`![](${this.editor.getSelection()})`);
      this.editor.moveCursorPosition(-1, 0);
      this.editor.focus();
    },
    insertBold() {
      this.editor.insert(`**${this.editor.getSelection()}**`);
      this.editor.moveCursorPosition(-2, 0);
      this.editor.focus();
    },
    insertItalic() {
      this.editor.insert(`_${this.editor.getSelection()}_`);
      this.editor.moveCursorPosition(-1, 0);
      this.editor.focus();
    },
    insertStrikethrough() {
      this.editor.insert(`~~${this.editor.getSelection()}~~`);
      this.editor.moveCursorPosition(-2, 0);
      this.editor.focus();
    },
    insertCode() {
      this.editor.insert(`\`${this.editor.getSelection()}\``);
      this.editor.moveCursorPosition(-1, 0);
      this.editor.focus();
    },
    insertQuote() {
      this.editor.insertPrefix(`> `);
      this.editor.focus();
    },
    insertListBulleted() {
      this.editor.insertPrefix(`- `);
      this.editor.focus();
    },
    insertListNumbered() {
      this.editor.insertPrefix(`1. `);
      this.editor.focus();
    },
    insertListChecked() {
      this.editor.insertPrefix(`- [ ] `);
      this.editor.focus();
    },
    changeViewMode() {
      this.$emit('changeViewMode', this.viewMode);
    }
  }
}
</script>

<style>
  .el-radio-button__inner,
  .el-radio-button__inner:hover {
    color: inherit;
  }
</style>


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

  .checkbox-mode {
    position: absolute;
    top: 11px;
    right: 15px;
  }
</style>
