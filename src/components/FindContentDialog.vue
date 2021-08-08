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
      :highlight-first-item="true"
      placeholder="Find text in folder"
      @select="handleNoteSelect"
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

<script>
import setting from '@config/setting.json'
import NoteUtil from '@scripts/note/note-util.js'
import { VIEW_MODE } from '@constants/index.js'

export default {
  data () {
    return {
      notePath: '',
      notes: []
    }
  },

  mounted () {
    this.notes = NoteUtil.readAllNotes(setting.directory)

    this.$store.watch(
      (state) => state.visibleFindContentDialog,
      (value) => {
        if (value) {
          this.$refs.noteInput.$refs.input.focus()
        }
      }
    )
  },

  methods: {
    queryFindContent (queryString, cb) {
      let filteredNotes = []
      if (queryString) {
        filteredNotes = this.notes.filter((n) => {
          return n.currentContent.toLowerCase().includes(queryString.toLowerCase())
        })
      } else {
        filteredNotes = NoteUtil.readRecentlyOpenedNotes()
      }
      const results = filteredNotes.map((n) => {
        return {
          label: n.fileName,
          path: n.filePath,
          relativePath: n.filePath.split(setting.directory)[1]
        }
      })
      cb(results)
    },

    handleNoteSelect (item) {
      this.notePath = ''
      if (!this.$store.state.note.isSaved) {
        if (!window.confirm('変更が保存されていません。変更を破棄してよいですか。')) {
          this.$refs.noteInput.$refs.input.blur()
          return
        }
      }
      this.$store.commit('hideFindContentDialog')
      this.$store.commit('changeNote', item.path)
      this.$store.commit('changeViewMode', VIEW_MODE.PREVIEW)
    },

    openDialog () {
      // HACK: closeDialogで消えたままになっていることがあるため戻す
      const element = document.querySelector('.find-content-popper')
      if (element) {
        element.style.display = 'block'
      }
    },

    closeDialog () {
      // HACK: ESCで閉じるとサジェストのみが残ってしまうので強制的に消す
      document.querySelector('.find-content-popper').style.display = 'none'
      this.$store.commit('hideFindContentDialog')
    }
  }
}
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
