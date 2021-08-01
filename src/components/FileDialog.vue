<template>
  <el-dialog
    :visible.sync="$store.state.fileSearchBoxVisible"
    :show-close="false"
    :lock-scroll="false"
    custom-class="file-dialog"
    width="400px"
    :before-close="closeDialog"
    @open="openDialog"
  >
    <el-autocomplete
      ref="fileInput"
      v-model="filePath"
      class="autocomplete"
      popper-class="autocomplete-popper"
      :fetch-suggestions="queryFileSearch"
      :highlight-first-item="true"
      placeholder="Search file to open"
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
import Vue from 'vue';
import setting from '@config/setting.json';
import Note from '@scripts/note/note.js';
import NoteUtil from '@scripts/note/note-util.js';
import { VIEW_MODE } from '@constants/index.js'

export default {
  data() {
    return {
      filePath: '',
      treeData: []
    };
  },

  mounted() {
    const notes = NoteUtil.readTree(setting.directory);
    this.treeData = notes.map((n) => {
      return {
        value: n.path,
        label: n.label,
        path: n.path,
        relativePath: n.relativePath
      }
    })

    this.$store.watch(
      (state) => state.fileSearchBoxVisible,
      (newValue, oldValue) => {
        if (newValue) {
          Vue.nextTick().then(() => this.$refs.fileInput.$refs.input.focus());
        }
      }
    )
  },
  methods: {
    queryFileSearch(queryString, cb) {
      let results = this.treeData;
      if (queryString) {
        results = this.treeData.filter((d) => d.relativePath.toLowerCase().includes(queryString.toLowerCase()))
      }
      cb(results);
    },

    handleFileSelect(item) {
      const note = new Note(item.path);
      this.$store.commit('changeCurrentFile', note.readPath());
      this.filePath = ''
      this.$store.commit('visualizeFileSearchBox', false);
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
      this.$store.commit('visualizeFileSearchBox', false);
    }
  }
}
</script>

<style lang="scss">
.file-dialog {
  &.el-dialog {
    background: transparent;
  }

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
  }
}

.autocomplete {
  width: 100%;
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
