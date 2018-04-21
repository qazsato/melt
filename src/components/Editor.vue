<template>
  <div class="editor-area" v-show="this.$store.state.mode === 'editor' || this.$store.state.mode === 'multi'">
    <textarea id="editor"></textarea>
    <el-dialog title="Hyperlink" :visible.sync="this.$store.state.linkDialogVisible" @open="openLinkDialog" :before-close="closeLinkDialog" width="400px">
      <el-form label-width="45px">
        <el-form-item label="Title">
          <el-input @keyup.enter.native="insertLink" placeholder="Please input" v-model="linkTitle" ref="linkTitleInput"></el-input>
        </el-form-item>
        <el-form-item label="URL">
          <el-input @keyup.enter.native="insertLink" placeholder="Please input" v-model="linkUrl" ref="linkUrlInput"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="insertLink">Insert</el-button>
        <el-button @click="closeLinkDialog">Cancel</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Image" :visible.sync="this.$store.state.imageDialogVisible" @open="openImageDialog" :before-close="closeImageDialog" width="400px">
       <el-form label-width="45px">
        <el-form-item label="Alt">
          <el-input @keyup.enter.native="insertImage" placeholder="Please input" v-model="imageAlt" ref="imageAltInput"></el-input>
        </el-form-item>
        <el-form-item label="URL">
          <el-input @keyup.enter.native="insertImage" placeholder="Please input" v-model="imageUrl" ref="imageUrlInput"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="insertImage">Insert</el-button>
        <el-button @click="closeImageDialog">Cancel</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Table" :visible.sync="this.$store.state.tableDialogVisible" @open="openTableDialog" :before-close="closeTableDialog" width="400px">
       <el-form label-width="45px">
        <el-form-item label="Row">
          <el-input-number @keyup.enter.native="insertTable" v-model="tableRow" :min="1" :max="10" ref="tableRowInput"></el-input-number>
        </el-form-item>
        <el-form-item label="Col">
          <el-input-number @keyup.enter.native="insertTable" v-model="tableColumn" :min="1" :max="10"></el-input-number>
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
import axios from 'axios';
import 'codemirror/lib/codemirror.css';
import '../assets/styles/melt-light.scss';
import 'codemirror/mode/gfm/gfm.js';
import 'codemirror/addon/edit/continuelist.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/dialog/dialog.css';
import settings from '../../config/settings.json';
import Editor from '../assets/scripts/MarkdownEditor';
import Note from '../assets/scripts/Note';
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
      const content = this.$store.state.note.readContent();
      this.editor.editor.getDoc().setValue(content);
    }
  },
  mounted() {
    this.editor = new Editor('editor');
    this.editor.on('change', () => this.$emit('changeText', this.editor.getText()));
    this.editor.addKeyMap({
      'Cmd-L': () => this.$store.commit('visualizeLinkDialog', true),
      'Cmd-P': () => this.$store.commit('visualizeImageDialog', true),
      'Cmd-B': () => this.editor.insertBold(),
      'Cmd-I': () => this.editor.insertItalic(),
      'Shift-Cmd-X': () => this.editor.insertStrikethrough(),
      'Cmd-K': () => this.editor.insertCode(),
      'Cmd-U': () => this.editor.insertQuote(),
      'Shift-Cmd-O': () => this.editor.insertBulletedList(),
      'Shift-Cmd-N': () => this.editor.insertNumberedList(),
      'Shift-Cmd-Y': () => this.editor.insertCheckedList(),
      'Cmd-T': () => this.$store.commit('visualizeTableDialog', true),
      'Cmd-S': () => this.saveFile()
    });
    this.$store.commit('setEditor', this.editor);
  },
  methods: {
    insertLink() {
      this.editor.insertLink(this.linkTitle, this.linkUrl);
      this.closeLinkDialog();
    },
    insertImage() {
      this.editor.insertImage(this.imageAlt, this.imageUrl);
      this.closeImageDialog();
    },
    insertTable() {
      this.editor.insertTable(this.tableRow, this.tableColumn);
      this.closeTableDialog();
    },
    openLinkDialog() {
      const text = this.editor.getSelection();
      if (text) {
        try {
          new URL(text);
          this.linkUrl = text;
          const url = `${settings.api}/web/title?url=${this.linkUrl}`;
          axios.get(url).then((res) => {
            if (this.linkTitle === '' && this.$store.state.linkDialogVisible === true) {
              this.linkTitle = res.data.title;
            }
          });
          setTimeout(() => this.$refs.linkTitleInput.$refs.input.focus());
        } catch(e) {
          this.linkTitle = text;
          setTimeout(() => this.$refs.linkUrlInput.$refs.input.focus());
        }
      } else {
        setTimeout(() => this.$refs.linkTitleInput.$refs.input.focus());
      }
    },
    closeLinkDialog() {
      this.linkTitle = '';
      this.linkUrl = '';
      this.editor.focus();
      this.$store.commit('visualizeLinkDialog', false);
    },
    openImageDialog() {
      const text = this.editor.getSelection();
      if (text) {
        try {
          new URL(text);
          this.imageUrl = text;
          setTimeout(() => this.$refs.imageAltInput.$refs.input.focus());
        } catch(e) {
          this.imageAlt = text;
          setTimeout(() => this.$refs.imageUrlInput.$refs.input.focus());
        }
      } else {
        setTimeout(() => this.$refs.imageAltInput.$refs.input.focus());
      }
    },
    closeImageDialog() {
      this.imageAlt = '';
      this.imageUrl = '';
      this.editor.focus();
      this.$store.commit('visualizeImageDialog', false);
    },
    openTableDialog() {
      setTimeout(() => this.$refs.tableRowInput.$refs.input.focus());
    },
    closeTableDialog() {
      this.tableRow = 3;
      this.tableColumn = 3;
      this.editor.focus();
      this.$store.commit('visualizeTableDialog', false);
    },
    saveFile() {
      const file = this.$store.state.currentFile;
      const title = this.editor.getTitle();
      this.$store.state.note.updateTitle(title);
      const content = this.editor.getText();
      this.$store.state.note.updateContent(content);
      this.$store.commit('updateTreeDatas');
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
}

#editor {
  width: 100%;
  height: 100%;
}
</style>
