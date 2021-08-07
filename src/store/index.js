import Vue from 'vue';
import Vuex from 'vuex';
import Note from '@scripts/note/note.js';
import { VIEW_MODE } from '@constants/index.js'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    note: null,
    currentFile: '',
    isUnsaved: false,
    viewMode: VIEW_MODE.EDITOR,
    editor: null,
    visibleLinkDialog: false,
    visibleImageDialog: false,
    visibleTableDialog: false,
    visibleFileNameSearch: false,
    visibleFileDataSearch: false
  },
  mutations: {
    createNewPost(state) {
      if (state.isUnsaved) {
        if (!window.confirm('変更が保存されていません。変更を破棄してよいですか。')) {
          return
        }
      }
      state.note = null
      state.currentFile = ''
      state.viewMode = VIEW_MODE.EDITOR
      Vue.nextTick().then(() => {
        state.editor.setText('')
        state.editor.focus()
      });
    },

    changeFile(state, file) {
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

    showLinkDialog(state) {
      state.visibleLinkDialog = true;
    },

    hideLinkDialog(state) {
      state.visibleLinkDialog = false;
    },

    showImageDialog(state) {
      state.visibleImageDialog = true;
    },

    hideImageDialog(state) {
      state.visibleImageDialog = false;
    },

    showTableDialog(state) {
      state.visibleTableDialog = true;
    },

    hideTableDialog(state) {
      state.visibleTableDialog = false;
    },

    showFileNameSearch(state) {
      state.visibleFileNameSearch = true;
    },

    hideFileNameSearch(state) {
      state.visibleFileNameSearch = false;
    },

    showFileDataSearch(state) {
      state.visibleFileDataSearch = true;
    },

    hideFileDataSearch(state) {
      state.visibleFileDataSearch = false;
    }
  }
});

export default store;
