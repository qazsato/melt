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
      @select="handleNoteSelect"
    >
      <template slot-scope="{ item }">
        <div class="label">
          {{ item.label }}
        </div>
        <span class="path">.{{ item.relativePath }}</span>
        <li
          v-for="(row, index) in item.rows"
          :key="index"
          class="row"
        >
          {{ row }}
        </li>
      </template>
    </el-autocomplete>
  </el-dialog>
</template>

<script>
import setting from '@config/setting.json'
import { readAllNotes, readRecentlyOpenedNotes } from '@utils/note.js'
import { VIEW_MODE } from '@constants/index.js'

export default {
  data () {
    return {
      notePath: '',
      notes: []
    }
  },

  computed: {
    visibleFindContentDialog () {
      return this.$store.state.visibleFindContentDialog
    }
  },

  watch: {
    visibleFindContentDialog (value) {
      if (value) {
        this.$nextTick().then(() => this.$refs.noteInput.$refs.input.focus())
      }
    }
  },

  methods: {
    queryFindContent (query, callback) {
      let filteredNotes = []
      if (query) {
        filteredNotes = this.notes.filter((n) => n.find(query).length > 0)
      } else {
        filteredNotes = readRecentlyOpenedNotes()
      }
      const results = filteredNotes.map((n) => {
        return {
          label: n.fileName,
          path: n.filePath,
          relativePath: n.filePath.split(setting.directory)[1],
          rows: query ? n.find(query) : []
        }
      })
      callback(results)
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
      this.notes = readAllNotes(setting.directory)
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
