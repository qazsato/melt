<template>
  <section id="toolbar">
    <el-tooltip content="Hyperlink (⌘L)" :open-delay="500">
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
      <button @click="insertBulletedList">
        <i class="icon-list_bulleted"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Numbered List (⌘+U)" :open-delay="500">
      <button @click="insertNumberedList">
        <i class="icon-list_numbered"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Checked List (⌘+Y)" :open-delay="500">
      <button @click="insertCheckedList">
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
      this.editor.insertLink();
      this.editor.focus();
    },
    insertImage() {
      this.editor.insertImage();
      this.editor.focus();
    },
    insertBold() {
      this.editor.insertBold();
      this.editor.focus();
    },
    insertItalic() {
      this.editor.insertItalic();
      this.editor.focus();
    },
    insertStrikethrough() {
      this.editor.insertStrikethrough();
      this.editor.focus();
    },
    insertCode() {
      this.editor.insertCode();
      this.editor.focus();
    },
    insertQuote() {
      this.editor.insertQuote();
      this.editor.focus();
    },
    insertBulletedList() {
      this.editor.insertBulletedList();
      this.editor.focus();
    },
    insertNumberedList() {
      this.editor.insertNumberedList();
      this.editor.focus();
    },
    insertCheckedList() {
      this.editor.insertCheckedList();
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
