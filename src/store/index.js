import Vue from 'vue';
import Vuex from 'vuex';
import Note from '../assets/scripts/Note';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    note: null,
    currentFile: '',
    mode: 'multi',
    editor: null,
    linkDialogVisible: false,
    imageDialogVisible: false,
    tableDialogVisible: false
  },
  mutations: {
    changeCurrentFile(state, file) {
      state.currentFile = file;
      state.note = new Note(file);
    },
    changeMode(state, mode) {
      state.mode = mode;
    },
    setEditor(state, editor) {
      state.editor = editor;
    },
    visualizeLinkDialog(state, visible) {
      state.linkDialogVisible = visible;
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
