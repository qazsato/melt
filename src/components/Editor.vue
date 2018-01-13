<template>
  <div class="editor-area" v-show="mode === 'editor' || mode === 'multi'">
    <textarea id="editor"></textarea>
    <el-dialog title="Hyperlink" :visible.sync="linkDialogVisible">
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
    <el-dialog title="Image" :visible.sync="imageDialogVisible">
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
  </div>
</template>

<script>
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/base16-light.css';
import '../styles/MarkdownEditor.css';
import 'codemirror/mode/gfm/gfm.js';
import 'codemirror/addon/edit/continuelist.js';
import Editor from '../scripts/MarkdownEditor';
export default {
  props: ['mode'],
  data() {
    return {
      editor: null,
      linkDialogVisible: false,
      linkTitle: '',
      linkUrl: '',
      imageDialogVisible: false,
      imageAlt: '',
      imageUrl: '',
    };
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
      'Cmd-T': () => this.editor.insertTable()
    });
    this.$emit('mountEditor', this.editor);
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
    openLinkDialog() {
      const text = this.editor.getSelection();
      try {
        new URL(text);
        this.linkUrl = text;
      } catch(e) {
        this.linkTitle = text;
      }
      this.linkDialogVisible = true;
    },
    closeLinkDialog() {
      this.linkDialogVisible = false;
      this.linkTitle = '';
      this.linkUrl = '';
      this.editor.focus();
    },
    openImageDialog() {
      const text = this.editor.getSelection();
      try {
        new URL(text);
        this.imageUrl = text;
      } catch(e) {
        this.imageAlt = text;
      }
      this.imageDialogVisible = true;
    },
    closeImageDialog() {
      this.imageDialogVisible = false;
      this.imageAlt = '';
      this.imageUrl = '';
      this.editor.focus();
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
