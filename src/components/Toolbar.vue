<template>
  <section id="toolbar">
    <el-tooltip content="Hyperlink (⌘L)" :open-delay="500">
      <button @click="insertLink" :disabled="mode === 'preview'">
        <i class="icon-link"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Image (⌘G)" :open-delay="500">
      <button @click="insertImage" :disabled="mode === 'preview'">
        <i class="icon-photo"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Bold (⌘B)" :open-delay="500">
      <button @click="insertBold" :disabled="mode === 'preview'">
        <i class="icon-bold"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Italic (⌘I)" :open-delay="500">
      <button @click="insertItalic" :disabled="mode === 'preview'">
        <i class="icon-italic"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Strikethrough (⌘+Shift+X)" :open-delay="500">
      <button @click="insertStrikethrough" :disabled="mode === 'preview'">
        <i class="icon-strikethrough"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Code (⌘+K)" :open-delay="500">
      <button @click="insertCode" :disabled="mode === 'preview'">
        <i class="icon-code"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Quote (⌘+I)" :open-delay="500">
      <button @click="insertQuote" :disabled="mode === 'preview'">
        <i class="icon-quote"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Bulleted List (⌘+O)" :open-delay="500">
      <button @click="insertBulletedList" :disabled="mode === 'preview'">
        <i class="icon-list_bulleted"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Numbered List (⌘+U)" :open-delay="500">
      <button @click="insertNumberedList" :disabled="mode === 'preview'">
        <i class="icon-list_numbered"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Checked List (⌘+Y)" :open-delay="500">
      <button @click="insertCheckedList" :disabled="mode === 'preview'">
        <i class="icon-list_checked"></i>
      </button>
    </el-tooltip>
    <el-tooltip content="Table (⌘+T)" :open-delay="500">
      <button @click="insertTable" :disabled="mode === 'preview'">
        <i class="icon-table"></i>
      </button>
    </el-tooltip>
    <el-radio-group @change="changeViewMode" v-model="mode" size="mini" fill="#00b1b3" class="checkbox-mode">
      <el-radio-button label="multi">A</el-radio-button>
      <el-radio-button label="editor">B</el-radio-button>
      <el-radio-button label="preview">C</el-radio-button>
    </el-radio-group>
  </section>
</template>

<script>
export default {
  data() {
    return {
      mode: this.$store.state.mode
    };
  },
  methods: {
    insertLink() {
      this.$store.commit('visualizeLinkDialog', true);
    },
    insertImage() {
      this.$store.commit('visualizeImageDialog', true);
    },
    insertBold() {
      this.$store.state.editor.insertBold();
      this.$store.state.editor.focus();
    },
    insertItalic() {
      this.$store.state.editor.insertItalic();
      this.$store.state.editor.focus();
    },
    insertStrikethrough() {
      this.$store.state.editor.insertStrikethrough();
      this.$store.state.editor.focus();
    },
    insertCode() {
      this.$store.state.editor.insertCode();
      this.$store.state.editor.focus();
    },
    insertQuote() {
      this.$store.state.editor.insertQuote();
      this.$store.state.editor.focus();
    },
    insertBulletedList() {
      this.$store.state.editor.insertBulletedList();
      this.$store.state.editor.focus();
    },
    insertNumberedList() {
      this.$store.state.editor.insertNumberedList();
      this.$store.state.editor.focus();
    },
    insertCheckedList() {
      this.$store.state.editor.insertCheckedList();
      this.$store.state.editor.focus();
    },
    insertTable() {
      this.$store.state.editor.insertTable();
      this.$store.state.editor.focus();
    },
    changeViewMode() {
      this.$store.commit('changeMode', this.mode);
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
