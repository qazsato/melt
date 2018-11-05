import Vue from 'vue';
import Vuex from 'vuex';
import Note from '../assets/scripts/note.js';
import settings from '../../config/settings.json';
import NoteUtil from '../assets/scripts/note-util.js';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    note: null,
    currentFile: '',
    mode: 'editor',
    editor: null,
    treeDatas: null,
    suggestDatas: null,
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
      state.treeDatas = NoteUtil.readTree(settings.directory);
    },
    updateSuggestDatas(state) {
      const tags = NoteUtil.readAllTags();
      state.suggestDatas = tags.map((t) => {return {value: t}});
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
