<template>
  <el-dialog
    :visible.sync="$store.state.visibleFindContentDialog"
    :show-close="false"
    :lock-scroll="false"
    custom-class="find-content-dialog"
    width="400px"
    :before-close="closeDialog"
    @open="openDialog"
  >
    <el-autocomplete
      ref="noteInput"
      v-model="notePath"
      class="autocomplete"
      popper-class="find-content-popper"
      :fetch-suggestions="queryFindContent"
      placeholder="Find text in folder"
      :highlight-first-item="true"
      @keydown.native="onKeydown"
      @select="onSelect"
    >
      <template slot-scope="{ item }">
        <div class="label">
          {{ item.label }}
        </div>
        <span class="path">.{{ item.relativePath }}</span>
        <li v-for="(row, index) in item.rows" :key="index" class="row">
          {{ row }}
        </li>
      </template>
    </el-autocomplete>
  </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import setting from '@config/setting.json'
import { readAllNotes, readRecentlyOpenedNotes } from '@/utils/note'
import { VIEW_MODE } from '@/constants'
import Note from '@/assets/scripts/note/note'

interface Suggestion {
  label: string
  path: string
  relativePath: string
  rows: string[]
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
    visibleFindContentDialog() {
      return this.$store.state.visibleFindContentDialog
    },
  },

  watch: {
    visibleFindContentDialog(value) {
      if (value) {
        this.$nextTick().then(() => {
          // @ts-ignore
          this.$refs.noteInput.$refs.input.focus()
        })
      }
    },
  },

  methods: {
    queryFindContent(query: string, callback: (suggestion: Suggestion[]) => void) {
      let filteredNotes = []
      if (query) {
        filteredNotes = this.notes.filter((n: Note) => n.find(query).length > 0)
      } else {
        filteredNotes = readRecentlyOpenedNotes()
      }
      this.suggestions = filteredNotes.map((n) => {
        return {
          label: n.fileName,
          path: n.filePath,
          relativePath: n.filePath.split(setting.directory)[1],
          rows: query ? n.find(query) : [],
        }
      })
      callback(this.suggestions)
    },

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
        this.$store.commit('hideFindContentDialog')
        this.$store.commit('changeNote', item.path)
        this.$store.commit('changeViewMode', VIEW_MODE.PREVIEW)
      })
    },

    openDialog() {
      this.notes = readAllNotes(setting.directory)
      // HACK: closeDialogで消えたままになっているため戻す
      const ele = <HTMLElement>document.querySelector('.find-content-popper')
      if (ele && this.suggestions.length > 0) {
        ele.style.display = 'block'
      }
    },

    closeDialog() {
      this.notePath = ''
      // HACK: ESCで閉じるとサジェストのみが残ってしまうので強制的に消す
      const ele = <HTMLElement>document.querySelector('.find-content-popper')
      ele.style.display = 'none'
      this.$store.commit('hideFindContentDialog')
    },
  },
})
</script>

<style lang="scss">
.find-content-dialog {
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

.find-content-popper {
  .el-autocomplete-suggestion__list {
    > li {
      line-height: normal;
      padding: 7px 14px;

      .label {
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .path,
      .row {
        font-size: 12px;
        color: #b4b4b4;
      }

      .row {
        margin: 6px 14px;
        padding: 0;
        line-height: normal;
      }
    }
  }
}
</style>
