import { createStore } from 'vuex'
import Note from '@/assets/scripts/note/note'
import { INITIAL_NOTE, VIEW_MODE } from '@/constants'
import { updateBrowsingHistory } from '@/utils/local-storage'
import { Preference } from '@/config/setting'
import { getPreference, updatePreference, getBrowsingHistories } from '@/utils/local-storage'
import { isExistPath } from '@/utils/note'

export interface State {
  preference: Preference
  note: Note
  viewMode: string
  visibleLinkDialog: boolean
  visibleImageDialog: boolean
  visibleTableDialog: boolean
  visibleFindParagraphDialog: boolean
  visibleFindTitleDialog: boolean
  visibleFindContentDialog: boolean
  visibleRenameDialog: boolean
}

const preference: Preference = getPreference()
let path
if (preference.initialNote === INITIAL_NOTE.RECENTRY_OPENED) {
  const latestPath = getBrowsingHistories()[0]
  if (isExistPath(latestPath)) {
    path = latestPath
  }
}
const note: Note = new Note(path)

const state: State = {
  preference: preference,
  note: note,
  viewMode: VIEW_MODE.EDITOR,
  visibleLinkDialog: false,
  visibleImageDialog: false,
  visibleTableDialog: false,
  visibleFindParagraphDialog: false,
  visibleFindTitleDialog: false,
  visibleFindContentDialog: false,
  visibleRenameDialog: false,
}

export const store = createStore({
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
      }
    },

    updatePreference(state, preference: Preference) {
      state.preference = preference
      updatePreference(preference)
    },

    changeViewMode(state, viewMode: string) {
      state.viewMode = viewMode
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
