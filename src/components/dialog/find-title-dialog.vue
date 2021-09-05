<template>
  <el-dialog
    :visible.sync="$store.state.visibleFindTitleDialog"
    :show-close="false"
    :lock-scroll="false"
    custom-class="find-title-dialog"
    width="400px"
    :before-close="closeDialog"
    @open="openDialog"
  >
    <el-autocomplete
      ref="noteInput"
      v-model="notePath"
      class="autocomplete"
      popper-class="find-title-popper"
      :fetch-suggestions="queryFindTitle"
      placeholder="Find name in folder"
      :highlight-first-item="true"
      @keydown.native="onKeydown"
      @select="onSelect"
    >
      <template slot-scope="{ item }">
        <div class="label">
          {{ item.label }}
        </div>
        <span class="path">.{{ item.relativePath }}</span>
      </template>
    </el-autocomplete>
  </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import setting from '@/config/setting'
import { readAllNotes, readRecentlyOpenedNotes } from '@/utils/note'
import { VIEW_MODE } from '@/constants'
import Note from '@/assets/scripts/note/note'

interface Suggestion {
  label: string
  path: string
  relativePath: string
}

interface DataType {
  notePath: string
  notes: Note[]
  suggestions: Suggestion[]
  isComposing: boolean
}

export default Vue.extend({
  data() {
    const data: DataType = {
      notePath: '',
      notes: [],
      suggestions: [],
      isComposing: false, // 日本語入力(IME)が未確定か否か
    }
    return data
  },

  computed: {
    visibleFindTitleDialog() {
      return this.$store.state.visibleFindTitleDialog
    },
  },

  watch: {
    visibleFindTitleDialog(value) {
      if (value) {
        this.$nextTick().then(() => {
          // @ts-ignore
          this.$refs.noteInput.$refs.input.focus()
        })
      }
    },
  },

  methods: {
    queryFindTitle(query: string, callback: (suggestion: Suggestion[]) => void) {
      let filteredNotes = []
      if (query) {
        filteredNotes = this.notes.filter((n: Note) => {
          const relativePath = n.filePath.split(setting.directory)[1]
          return relativePath.toLowerCase().includes(query.toLowerCase())
        })
      } else {
        filteredNotes = readRecentlyOpenedNotes()
      }
      this.suggestions = filteredNotes.map((n) => {
        return {
          label: n.fileName,
          path: n.filePath,
          relativePath: n.filePath.split(setting.directory)[1],
        }
      })
      callback(this.suggestions)
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onKeydown(e: any) {
      this.isComposing = e.isComposing
    },

    onSelect(item: Suggestion) {
      // HACK: イベント処理順を keydown => select としたいためタイミングをずらしている
      setTimeout(() => {
        if (this.isComposing) {
          return
        }
        if (this.$store.state.note.isChanged) {
          if (!window.confirm('変更が保存されていません。変更を破棄してよいですか。')) {
            // @ts-ignore
            this.$refs.noteInput.$refs.input.blur()
            return
          }
        }
        this.$store.commit('hideFindTitleDialog')
        this.$store.commit('changeNote', item.path)
        this.$store.commit('changeViewMode', VIEW_MODE.PREVIEW)
      })
    },

    openDialog() {
      this.notes = readAllNotes(setting.directory)
      // HACK: closeDialogで消えたままになっているため戻す
      const ele = document.querySelector('.find-title-popper') as HTMLElement
      if (ele && this.suggestions.length > 0) {
        ele.style.display = 'block'
      }
    },

    closeDialog() {
      this.notePath = ''
      // HACK: ESCで閉じるとサジェストのみが残ってしまうので強制的に消す
      const ele = document.querySelector('.find-title-popper') as HTMLElement
      ele.style.display = 'none'
      this.$store.commit('hideFindTitleDialog')
    },
  },
})
</script>

<style lang="scss">
.find-title-dialog {
  &.el-dialog {
    background: transparent;
  }

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
  }

  .autocomplete {
    width: 100%;
  }
}

.find-title-popper {
  ul {
    li {
      line-height: normal;
      padding: 7px 14px;

      .label {
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .path {
        font-size: 12px;
        color: #b4b4b4;
      }
    }
  }
}
</style>
