import Vue from 'vue';
import Vuex from 'vuex';
import Note from '@scripts/note/note.js';
import setting from '@config/setting.json';
import NoteUtil from '@scripts/note/note-util.js';
import { VIEW_MODE } from '@constants/index.js'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    note: null,
    currentFile: '',
    isUnsaved: false,
    viewMode: VIEW_MODE.EDITOR,
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
      state.viewMode = VIEW_MODE.EDITOR
      Vue.nextTick().then(() => {
        state.editor.setText('')
        state.editor.focus()
      });
    },

    changeFile(state, file) {
      // エディタとノートの内容に差分がある場合は切替前に保存する
      if (state.note && state.editor && state.editor.getText() !== state.note.readContent()) {
        const title = state.editor.getTitle();
        const content = state.editor.getText();
        state.note.updateTitle(title);
        state.note.updateContent(content);
        this.commit('updateFiles');
      }
      state.currentFile = file;
      state.note = new Note(file);
    },

    updateIsUnsaved(state) {
      const content = state.note ? state.note.readContent() : ''
      state.isUnsaved = state.editor.getText() !== content
    },

    toggleViewMode(state) {
      if (state.viewMode === VIEW_MODE.EDITOR) {
        state.viewMode = VIEW_MODE.PREVIEW
      } else {
        state.viewMode = VIEW_MODE.EDITOR
        Vue.nextTick().then(() => state.editor.focus());
      }
    },

    changeViewMode(state, viewMode) {
      state.viewMode = viewMode;
      if (state.viewMode === VIEW_MODE.EDITOR) {
        Vue.nextTick().then(() => state.editor.focus());
      }
    },

    setEditor(state, editor) {
      state.editor = editor;
    },

    updateFiles(state) {
      state.treeDatas = NoteUtil.readTree(setting.directory);
      store.commit('updateIsUnsaved');
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
