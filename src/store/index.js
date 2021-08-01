import Vue from 'vue';
import Vuex from 'vuex';
import Note from '@scripts/note/note.js';
import settings from '@config/settings.json';
import NoteUtil from '@scripts/note/note-util.js';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    note: null,
    currentFile: '',
    mode: 'editor',
    editor: null,
    treeDatas: null,
    linkDialogVisible: false,
    imageDialogVisible: false,
    tableDialogVisible: false,
    fileSearchBoxVisible: false,
  },
  mutations: {
    createNewPost(state) {
      state.note = null
      state.currentFile = ''
      state.editor.setText('')
    },

    changeCurrentFile(state, file) {
      // エディタとノートの内容に差分がある場合は切替前に保存する
      if (state.note && state.editor && state.editor.getText() !== state.note.readContent()) {
        const title = state.editor.getTitle();
        const content = state.editor.getText();
        state.note.updateTitle(title);
        state.note.updateContent(content);
        this.commit('updateTreeDatas');
      }
      state.currentFile = file;
      state.note = new Note(file);
    },
    changeMode(state, mode) {
      state.mode = mode;
    },
    setEditor(state, editor) {
      state.editor = editor;
    },
    updateTreeDatas(state) {
      state.treeDatas = NoteUtil.readTree(settings.directory);
    },
    visualizeLinkDialog(state, visible) {
      state.linkDialogVisible = visible;
    },
    visualizeFileSearchBox(state, visible) {
      state.fileSearchBoxVisible = visible;
    },
    visualizeImageDialog(state, visible) {
      state.imageDialogVisible = visible;
    },
    visualizeTableDialog(state, visible) {
      state.tableDialogVisible = visible;
    }
  }
});

export default store;
