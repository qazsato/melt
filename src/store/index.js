import Vue from 'vue';
import Vuex from 'vuex';
import Note from '../assets/scripts/Note';
import settings from '../../config/settings.json';
import FileUtil from '../assets/scripts/FileUtil';

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
    updateTreeDatas(state) {
      state.treeDatas = FileUtil.readTree(settings.directory);
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
