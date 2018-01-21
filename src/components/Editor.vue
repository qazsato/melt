<template>
  <div class="editor-area" v-show="this.$store.state.mode === 'editor' || this.$store.state.mode === 'multi'">
    <textarea id="editor"></textarea>
    <el-dialog title="Hyperlink" :visible.sync="this.$store.state.linkDialogVisible" :show-close="false" :close-on-click-modal="false">
      <el-form label-width="45px">
        <el-form-item label="Title">
          <el-input placeholder="Please input" v-model="linkTitle"></el-input>
        </el-form-item>
        <el-form-item label="URL">
          <el-input placeholder="Please input" v-model="linkUrl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="insertLink">Insert</el-button>
        <el-button @click="closeLinkDialog">Cancel</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Image" :visible.sync="this.$store.state.imageDialogVisible" :show-close="false" :close-on-click-modal="false">
       <el-form label-width="45px">
        <el-form-item label="Alt">
          <el-input placeholder="Please input" v-model="imageAlt"></el-input>
        </el-form-item>
        <el-form-item label="URL">
          <el-input placeholder="Please input" v-model="imageUrl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="insertImage">Insert</el-button>
        <el-button @click="closeImageDialog">Cancel</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Table" :visible.sync="this.$store.state.tableDialogVisible" :show-close="false" :close-on-click-modal="false">
       <el-form label-width="45px">
        <el-form-item label="Row">
          <el-input-number v-model="tableRow" :min="1" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="Col">
          <el-input-number v-model="tableColumn" :min="1" :max="10"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="insertTable">Insert</el-button>
        <el-button @click="closeTableDialog">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import fs from 'fs';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/base16-light.css';
import '../styles/MarkdownEditor.css';
import 'codemirror/mode/gfm/gfm.js';
import 'codemirror/addon/edit/continuelist.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/dialog/dialog.css';
import Editor from '../scripts/MarkdownEditor';
export default {
  data() {
    return {
      editor: null,
      linkTitle: '',
      linkUrl: '',
      imageAlt: '',
      imageUrl: '',
      tableRow: 3,
      tableColumn: 3
    };
  },
  computed: {
    file() {
      return this.$store.state.currentFile;
    }
  },
  watch: {
    file(file) {
      const text = fs.readFileSync(file, 'utf-8');
      this.editor.editor.getDoc().setValue(text);
    }
  },
  mounted() {
    this.editor = new Editor('editor');
    this.editor.on('change', () => this.$emit('changeText', this.editor.getText()));
    this.editor.addKeyMap({
      'Cmd-L': () => this.openLinkDialog(),
      'Cmd-G': () => this.openImageDialog(),
      'Cmd-B': () => this.editor.insertBold(),
      'Cmd-I': () => this.editor.insertItalic(),
      'Shift-Cmd-X': () => this.editor.insertStrikethrough(),
      'Cmd-K': () => this.editor.insertCode(),
      'Cmd-O': () => this.editor.insertBulletedList(),
      'Cmd-U': () => this.editor.insertNumberedList(),
      'Cmd-Y': () => this.editor.insertCheckedList(),
      'Cmd-T': () => this.openTableDialog(),
      'Cmd-S': () => this.saveFile()
    });
    this.$store.commit('setEditor', this.editor);
  },
  methods: {
    insertLink() {
      this.editor.insert(`[${this.linkTitle}](${this.linkUrl})`);
      this.closeLinkDialog();
    },
    insertImage() {
      this.editor.insert(`![${this.imageAlt}](${this.imageUrl})`);
      this.closeImageDialog();
    },
    insertTable() {
      this.editor.insertTable(this.tableRow, this.tableColumn);
      this.closeTableDialog();
    },
    openLinkDialog() {
      const text = this.editor.getSelection();
      try {
        new URL(text);
        this.linkUrl = text;
      } catch(e) {
        this.linkTitle = text;
      }
      this.$store.commit('visualizeLinkDialog', true);
    },
    closeLinkDialog() {
      this.linkTitle = '';
      this.linkUrl = '';
      this.editor.focus();
      this.$store.commit('visualizeLinkDialog', false);
    },
    openImageDialog() {
      const text = this.editor.getSelection();
      try {
        new URL(text);
        this.imageUrl = text;
      } catch(e) {
        this.imageAlt = text;
      }
      this.$store.commit('visualizeImageDialog', true);
    },
    closeImageDialog() {
      this.imageAlt = '';
      this.imageUrl = '';
      this.editor.focus();
      this.$store.commit('visualizeImageDialog', false);
    },
    openTableDialog() {
      this.$store.commit('visualizeTableDialog', true);
    },
    closeTableDialog() {
      this.tableRow = 3;
      this.tableColumn = 3;
      this.$store.commit('visualizeTableDialog', false);
    },
    saveFile() {
      fs.writeFileSync(this.$store.state.currentFile, this.editor.getText());
    }
  }
}
</script>

<style>
  .el-dialog__body {
    padding: 20px 20px 0;
  }
</style>

<style scoped>
  .editor-area {
    flex: 1;
    min-width: 50%;
    height: 100%;
    background-color: #fafafa;
  }

  #editor {
    width: 100%;
    height: 100%;
    background-color: #fafafa;
  }
</style>
