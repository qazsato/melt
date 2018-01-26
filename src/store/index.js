import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentFile: 'Untitled',
    mode: 'multi',
    editor: null,
    linkDialogVisible: false,
    imageDialogVisible: false,
    tableDialogVisible: false,
    fileDialogVisible: false,
    folderDialogVisible: false
  },
  mutations: {
    changeCurrentFile(state, file) {
      state.currentFile = file;
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
    },
    visualizeFileDialog(state, visible) {
      state.fileDialogVisible = visible;
    },
    visualizeFolderDialog(state, visible) {
      state.folderDialogVisible = visible;
    }
  }
});

export default store;
