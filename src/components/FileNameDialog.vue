<template>
  <el-dialog
    :visible.sync="$store.state.visibleFileNameSearch"
    :show-close="false"
    :lock-scroll="false"
    custom-class="file-name-dialog"
    width="400px"
    :before-close="closeDialog"
    @open="openDialog"
  >
    <el-autocomplete
      ref="fileInput"
      v-model="filePath"
      class="autocomplete"
      popper-class="autocomplete-popper"
      :fetch-suggestions="queryFileNameSearch"
      :highlight-first-item="true"
      placeholder="Find name in folder"
      @select="handleFileSelect"
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
import setting from '@config/setting.json';
import Note from '@scripts/note/note.js';
import NoteUtil from '@scripts/note/note-util.js';
import { VIEW_MODE } from '@constants/index.js'

export default {
  data() {
    return {
      filePath: '',
      notes: [],
    };
  },

  mounted() {
    this.notes = NoteUtil.readAllNotes(setting.directory);

    this.$store.watch(
      (state) => state.visibleFileNameSearch,
      (newValue, oldValue) => {
        if (newValue) {
          this.$refs.fileInput.$refs.input.focus();
        }
      }
    )
  },

  methods: {
    queryFileNameSearch(queryString, cb) {
      let filteredNotes = []
      if (queryString) {
        filteredNotes = this.notes.filter((n) => {
          const relativePath = n.readPath().split(setting.directory)[1]
          return relativePath.toLowerCase().includes(queryString.toLowerCase())
        })
      } else {
        filteredNotes = NoteUtil.readRecentlyOpenedNotes()
      }
      const results = filteredNotes.map((n) => {
        const path = n.readPath()
        return {
          label: n.readTitle(),
          path: path,
          relativePath: path.split(setting.directory)[1]
        }
      })
      cb(results);
    },

    handleFileSelect(item) {
      this.filePath = ''
      if (this.$store.state.isUnsaved) {
        if (!window.confirm('変更が保存されていません。変更を破棄してよいですか。')) {
          this.$refs.fileInput.$refs.input.blur()
          return
        }
      }
      this.$store.commit('hideFileNameSearch');
      const note = new Note(item.path);
      this.$store.commit('changeFile', note.readPath());
      this.$store.commit('changeViewMode', VIEW_MODE.PREVIEW);
    },

    openDialog() {
      // HACK: closeDialogで消えたままになっていることがあるため戻す
      const element = document.querySelector('.autocomplete-popper')
      if (element) {
       element.style.display = 'block';
      }
    },

    closeDialog() {
      // HACK: ESCで閉じるとサジェストのみが残ってしまうので強制的に消す
      document.querySelector('.autocomplete-popper').style.display = 'none';
      this.$store.commit('hideFileNameSearch');
    }
  }
}
</script>

<style lang="scss">
.file-name-dialog {
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

.autocomplete-popper {
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
