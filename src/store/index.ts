import Vue from 'vue'
import Vuex from 'vuex'
import Note from '@/assets/scripts/note/note'
import { THEME, VIEW_MODE } from '@/constants'
import { updateBrowsingHistory } from '@/utils/local-storage'
import Editor from '@/assets/scripts/editor/markdown-editor'

Vue.use(Vuex)

interface State {
  note: Note
  editor: Editor | null
  theme: string
  viewMode: string
  visibleLinkDialog: boolean
  visibleImageDialog: boolean
  visibleTableDialog: boolean
  visibleFindParagraphDialog: boolean
  visibleFindTitleDialog: boolean
  visibleFindContentDialog: boolean
  visibleRenameDialog: boolean
}

const state: State = {
  note: new Note(),
  editor: null,
  theme: THEME.LIGHT,
  viewMode: VIEW_MODE.EDITOR,
  visibleLinkDialog: false,
  visibleImageDialog: false,
  visibleTableDialog: false,
  visibleFindParagraphDialog: false,
  visibleFindTitleDialog: false,
  visibleFindContentDialog: false,
  visibleRenameDialog: false,
}

const store = new Vuex.Store({
  state,

  mutations: {
    createNewNote(state) {
      if (state.note.isChanged) {
        if (!window.confirm('変更が保存されていません。変更を破棄してよいですか。')) {
          return
        }
      }
      state.note = new Note()
      state.viewMode = VIEW_MODE.EDITOR
      void Vue.nextTick().then(() => {
        state.editor?.setText('')
        state.editor?.focus()
      })
    },

    changeNote(state, path) {
      state.note = new Note(path)
      updateBrowsingHistory(path)
    },

    updateNote(state, content) {
      state.note.update(content)
    },

    saveNote(state, path) {
      state.note.save(path)
    },

    renameNote(state, path) {
      try {
        state.note.rename(path)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (e.message === 'file path is exists.') {
          window.alert('同名のノートが存在しています')
        } else {
          window.alert('名前の変更に失敗しました')
        }
      }
    },

    deleteNote(state) {
      state.note.delete()
    },

    toggleViewMode(state) {
      if (state.viewMode === VIEW_MODE.EDITOR) {
        state.viewMode = VIEW_MODE.PREVIEW
      } else {
        state.viewMode = VIEW_MODE.EDITOR
        void Vue.nextTick().then(() => state.editor?.focus())
      }
    },

    changeTheme(state, theme: string) {
      state.theme = theme
      state.editor?.setTheme(theme)
    },

    changeViewMode(state, viewMode: string) {
      state.viewMode = viewMode
      if (state.viewMode === VIEW_MODE.EDITOR) {
        void Vue.nextTick().then(() => state.editor?.focus())
      }
    },

    setEditor(state, editor: Editor) {
      state.editor = editor
    },

    showLinkDialog(state) {
      state.visibleLinkDialog = true
    },

    hideLinkDialog(state) {
      state.visibleLinkDialog = false
    },

    showImageDialog(state) {
      state.visibleImageDialog = true
    },

    hideImageDialog(state) {
      state.visibleImageDialog = false
    },

    showTableDialog(state) {
      state.visibleTableDialog = true
    },

    hideTableDialog(state) {
      state.visibleTableDialog = false
    },

    showFindParagraphDialog(state) {
      state.visibleFindParagraphDialog = true
    },

    hideFindParagraphDialog(state) {
      state.visibleFindParagraphDialog = false
    },

    showFindTitleDialog(state) {
      state.visibleFindTitleDialog = true
    },

    hideFindTitleDialog(state) {
      state.visibleFindTitleDialog = false
    },

    showFindContentDialog(state) {
      state.visibleFindContentDialog = true
    },

    hideFindContentDialog(state) {
      state.visibleFindContentDialog = false
    },

    showRenameDialog(state) {
      state.visibleRenameDialog = true
    },

    hideRenameDialog(state) {
      state.visibleRenameDialog = false
    },
  },
})

export default store
