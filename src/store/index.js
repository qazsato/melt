import Vue from 'vue'
import Vuex from 'vuex'
import Note from '@scripts/note/note.js'
import { VIEW_MODE } from '@constants/index.js'
import { updateBrowsingHistory } from '@utils/local-storage.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    note: new Note(),
    editor: null,
    viewMode: VIEW_MODE.EDITOR,
    visibleLinkDialog: false,
    visibleImageDialog: false,
    visibleTableDialog: false,
    visibleFindParagraphDialog: false,
    visibleFindTitleDialog: false,
    visibleFindContentDialog: false
  },

  mutations: {
    createNewNote (state) {
      if (!state.note.isSaved) {
        if (!window.confirm('変更が保存されていません。変更を破棄してよいですか。')) {
          return
        }
      }
      state.note = new Note()
      state.viewMode = VIEW_MODE.EDITOR
      Vue.nextTick().then(() => {
        state.editor.setText('')
        state.editor.focus()
      })
    },

    changeNote (state, path) {
      state.note = new Note(path)
      updateBrowsingHistory(path)
    },

    updateNote (state, content) {
      state.note.update(content)
    },

    saveNote (state, path) {
      state.note.save(path)
    },

    toggleViewMode (state) {
      if (state.viewMode === VIEW_MODE.EDITOR) {
        state.viewMode = VIEW_MODE.PREVIEW
      } else {
        state.viewMode = VIEW_MODE.EDITOR
        Vue.nextTick().then(() => state.editor.focus())
      }
    },

    changeViewMode (state, viewMode) {
      state.viewMode = viewMode
      if (state.viewMode === VIEW_MODE.EDITOR) {
        Vue.nextTick().then(() => state.editor.focus())
      }
    },

    setEditor (state, editor) {
      state.editor = editor
    },

    showLinkDialog (state) {
      state.visibleLinkDialog = true
    },

    hideLinkDialog (state) {
      state.visibleLinkDialog = false
    },

    showImageDialog (state) {
      state.visibleImageDialog = true
    },

    hideImageDialog (state) {
      state.visibleImageDialog = false
    },

    showTableDialog (state) {
      state.visibleTableDialog = true
    },

    hideTableDialog (state) {
      state.visibleTableDialog = false
    },

    showFindParagraphDialog (state) {
      state.visibleFindParagraphDialog = true
    },

    hideFindParagraphDialog (state) {
      state.visibleFindParagraphDialog = false
    },

    showFindTitleDialog (state) {
      state.visibleFindTitleDialog = true
    },

    hideFindTitleDialog (state) {
      state.visibleFindTitleDialog = false
    },

    showFindContentDialog (state) {
      state.visibleFindContentDialog = true
    },

    hideFindContentDialog (state) {
      state.visibleFindContentDialog = false
    }
  }
})

export default store
