<template>
  <div
    v-show="isViewModeEditor"
    class="editor-area"
  >
    <textarea id="editor" />
    <el-dialog
      title="Hyperlink"
      :visible.sync="$store.state.visibleLinkDialog"
      :before-close="closeLinkDialog"
      :close-on-click-modal="false"
      width="400px"
      @open="openLinkDialog"
    >
      <el-form label-width="45px">
        <el-form-item label="Title">
          <el-input
            ref="linkTitleInput"
            v-model="linkTitle"
            placeholder="Please input"
            @keyup.enter.native="insertLink"
          />
        </el-form-item>
        <el-form-item label="URL">
          <el-input
            ref="linkUrlInput"
            v-model="linkUrl"
            placeholder="Please input"
            @keyup.enter.native="insertLink"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="insertLink"
        >
          Insert
        </el-button>
        <el-button @click="closeLinkDialog">
          Cancel
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Image"
      :visible.sync="$store.state.visibleImageDialog"
      :close-on-click-modal="false"
      width="400px"
      :before-close="closeImageDialog"
      @open="openImageDialog"
    >
      <el-form label-width="45px">
        <el-form-item label="Alt">
          <el-input
            ref="imageAltInput"
            v-model="imageAlt"
            placeholder="Please input"
            @keyup.enter.native="insertImage"
          />
        </el-form-item>
        <el-form-item label="URL">
          <el-input
            ref="imageUrlInput"
            v-model="imageUrl"
            placeholder="Please input"
            @keyup.enter.native="insertImage"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="insertImage"
        >
          Insert
        </el-button>
        <el-button @click="closeImageDialog">
          Cancel
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Table"
      :visible.sync="$store.state.visibleTableDialog"
      :close-on-click-modal="false"
      width="400px"
      :before-close="closeTableDialog"
      @open="openTableDialog"
    >
      <el-form label-width="45px">
        <el-form-item label="Row">
          <el-input-number
            ref="tableRowInput"
            v-model="tableRow"
            :max="10"
            :min="1"
            @keyup.enter.native="insertTable"
          />
        </el-form-item>
        <el-form-item label="Col">
          <el-input-number
            v-model="tableColumn"
            :max="10"
            :min="1"
            @keyup.enter.native="insertTable"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="insertTable"
        >
          Insert
        </el-button>
        <el-button @click="closeTableDialog">
          Cancel
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron';
import axios from 'axios';
import 'codemirror/lib/codemirror.css';
import '@styles/melt-light.scss';
import 'codemirror/mode/gfm/gfm.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/vue/vue.js';
import 'codemirror/mode/jsx/jsx.js';
import 'codemirror/mode/ruby/ruby.js';
import 'codemirror/mode/go/go.js';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/mode/shell/shell.js';
import 'codemirror/addon/edit/continuelist.js';
import setting from '@config/setting.json';
import Editor from '@scripts/editor/markdown-editor.js';
import Note from '@scripts/note/note.js';
import { VIEW_MODE } from '@constants/index.js'

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
    isViewModeEditor() {
      return this.$store.state.viewMode === VIEW_MODE.EDITOR
    },

    file() {
      return this.$store.state.currentFile;
    }
  },

  watch: {
    file(file) {
      if (!file) return;
      const content = this.$store.state.note.readContent();
      this.editor.setText(content);
    }
  },

  mounted() {
    this.editor = new Editor('editor');
    this.editor.on('change', () => this.$emit('changeText', this.editor.getText()));
    this.editor.addKeyMap({
      'Cmd-L': () => this.$store.commit('showLinkDialog'),
      'Shift-Cmd-P': () => this.$store.commit('showImageDialog'),
      'Cmd-B': () => this.editor.insertBold(),
      'Cmd-I': () => this.editor.insertItalic(),
      'Shift-Cmd-X': () => this.editor.insertStrikethrough(),
      'Cmd-K': () => this.editor.insertCode(),
      'Cmd-U': () => this.editor.insertQuote(),
      'Shift-Cmd-O': () => this.editor.insertBulletedList(),
      'Shift-Cmd-N': () => this.editor.insertNumberedList(),
      'Shift-Cmd-Y': () => this.editor.insertCheckedList(),
      'Cmd-T': () => this.$store.commit('showTableDialog'),
      'Cmd-S': () => this.saveFile()
    });
    this.$store.commit('setEditor', this.editor);

    this.$store.watch(
      (state) => state.viewMode,
      (newValue, oldValue) => {
        // NOTE: HTMLモードでファイル変更し、TEXTモードに切り替えた場合、変更前の情報が表示されたままとなってしまう。
        // その問題を回避するため、ここで再度テキストを設定して変更後の情報にする。
        if (newValue === VIEW_MODE.EDITOR) {
          // 未保存の情報を上書きしないように、保存済みの場合のみ設定する
          if (!this.$store.state.isUnsaved && this.$store.state.note) {
            this.editor.setText(this.$store.state.note.readContent());
          }
        }
      }
    )
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
          const url = `${setting.api}/web/title?url=${this.linkUrl}`;
          axios.get(url).then((res) => {
            if (this.linkTitle === '' && this.$store.state.visibleLinkDialog === true) {
              this.linkTitle = res.data.title;
            }
          });
          this.$nextTick().then(() => this.$refs.linkTitleInput.$refs.input.focus());
        } catch(e) {
          this.linkTitle = text;
          this.$nextTick().then(() => this.$refs.linkUrlInput.$refs.input.focus());
        }
      } else {
        this.$nextTick().then(() => this.$refs.linkTitleInput.$refs.input.focus());
      }
    },
    closeLinkDialog() {
      this.linkTitle = '';
      this.linkUrl = '';
      this.editor.focus();
      this.$store.commit('hideLinkDialog');
    },
    openImageDialog() {
      const text = this.editor.getSelection();
      if (text) {
        try {
          new URL(text);
          this.imageUrl = text;
          this.$nextTick().then(() => this.$refs.imageAltInput.$refs.input.focus());
        } catch(e) {
          this.imageAlt = text;
          this.$nextTick().then(() => this.$refs.imageUrlInput.$refs.input.focus());
        }
      } else {
        this.$nextTick().then(() => this.$refs.imageAltInput.$refs.input.focus());
      }
    },
    closeImageDialog() {
      this.imageAlt = '';
      this.imageUrl = '';
      this.editor.focus();
      this.$store.commit('hideImageDialog');
    },
    openTableDialog() {
      this.$nextTick().then(() => this.$refs.tableRowInput.$refs.input.focus());
    },
    closeTableDialog() {
      this.tableRow = 3;
      this.tableColumn = 3;
      this.editor.focus();
      this.$store.commit('hideTableDialog');
    },
    saveFile() {
      const content = this.editor.getText();
      if (this.$store.state.currentFile) {
        this.$store.state.note.updateContent(content);
        this.$store.commit('updateIsUnsaved');
      } else {
        ipcRenderer.invoke('file-save', content)
          .then((data) => {
            // キャンセルで閉じた
            if (data.status === undefined) {
              return;
            }
            // 保存できなかった
            if (data.status === false) {
              alert(`ファイルが開けませんでした。\n${data.message}`);
              return;
            }
            const note = new Note(data.path);
            this.$store.commit('changeFile', note.readPath());
          })
          .catch((err) => {
            alert(err);
          });
      }
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
