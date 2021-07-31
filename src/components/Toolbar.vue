<template>
  <section id="toolbar">
    <el-tooltip
      content="Hyperlink (⌘L)"
      :open-delay="500"
    >
      <button
        :disabled="mode === 'preview'"
        @click="insertLink"
      >
        <i class="icon-link" />
      </button>
    </el-tooltip>
    <el-tooltip
      content="Image (⌘P)"
      :open-delay="500"
    >
      <button
        :disabled="mode === 'preview'"
        @click="insertImage"
      >
        <i class="icon-photo" />
      </button>
    </el-tooltip>
    <el-tooltip
      content="Bold (⌘B)"
      :open-delay="500"
    >
      <button
        :disabled="mode === 'preview'"
        @click="insertBold"
      >
        <i class="icon-bold" />
      </button>
    </el-tooltip>
    <el-tooltip
      content="Italic (⌘I)"
      :open-delay="500"
    >
      <button
        :disabled="mode === 'preview'"
        @click="insertItalic"
      >
        <i class="icon-italic" />
      </button>
    </el-tooltip>
    <el-tooltip
      content="Strikethrough (⇧⌘X)"
      :open-delay="500"
    >
      <button
        :disabled="mode === 'preview'"
        @click="insertStrikethrough"
      >
        <i class="icon-strikethrough" />
      </button>
    </el-tooltip>
    <el-tooltip
      content="Code (⌘K)"
      :open-delay="500"
    >
      <button
        :disabled="mode === 'preview'"
        @click="insertCode"
      >
        <i class="icon-code" />
      </button>
    </el-tooltip>
    <el-tooltip
      content="Quote (⌘U)"
      :open-delay="500"
    >
      <button
        :disabled="mode === 'preview'"
        @click="insertQuote"
      >
        <i class="icon-quote" />
      </button>
    </el-tooltip>
    <el-tooltip
      content="Bulleted List (⇧⌘O)"
      :open-delay="500"
    >
      <button
        :disabled="mode === 'preview'"
        @click="insertBulletedList"
      >
        <i class="icon-list_bulleted" />
      </button>
    </el-tooltip>
    <el-tooltip
      content="Numbered List (⇧⌘N)"
      :open-delay="500"
    >
      <button
        :disabled="mode === 'preview'"
        @click="insertNumberedList"
      >
        <i class="icon-list_numbered" />
      </button>
    </el-tooltip>
    <el-tooltip
      content="Checked List (⇧⌘Y)"
      :open-delay="500"
    >
      <button
        :disabled="mode === 'preview'"
        @click="insertCheckedList"
      >
        <i class="icon-list_checked" />
      </button>
    </el-tooltip>
    <el-tooltip
      content="Table (⌘T)"
      :open-delay="500"
    >
      <button
        :disabled="mode === 'preview'"
        @click="insertTable"
      >
        <i class="icon-table" />
      </button>
    </el-tooltip>
    <el-tooltip
      content="Delete"
      :open-delay="500"
    >
      <button
        :disabled="mode === 'preview'"
        @click="deleteFile"
      >
        <i class="icon-delete" />
      </button>
    </el-tooltip>
    <el-radio-group
      v-model="mode"
      class="checkbox-mode"
      size="mini"
      @change="changeViewMode"
    >
      <el-radio-button label="editor">
        TEXT
      </el-radio-button>
      <el-radio-button label="preview">
        HTML
      </el-radio-button>
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
      this.$store.commit('visualizeTableDialog', true);
    },
    deleteFile() {
      this.$store.state.note.delete();
      this.$store.commit('updateTreeDatas');
      this.$store.commit('changeCurrentFile', this.$store.state.treeDatas[0].path);
    },
    changeViewMode() {
      this.$store.commit('changeMode', this.mode);
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
    margin: 5px 0;
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

  @media (max-width: 900px) {
    #toolbar > button {
      display: none;
    }
  }
</style>
