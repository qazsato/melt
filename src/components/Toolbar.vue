<template>
  <section id="toolbar">
    <h1 class="file-name">
      <template v-if="$store.state.currentFile">
        <el-tooltip
          :content="$store.state.currentFile"
          :open-delay="200"
        >
          <div>{{ fileName }}</div>
        </el-tooltip>
      </template>
      <template v-else>
        <div>{{ fileName }}</div>
      </template>
    </h1>

    <el-radio-group
      v-model="mode"
      class="checkbox-mode"
      size="mini"
      @change="changeViewMode"
    >
      <el-radio-button label="editor">
        TEXT
      </el-radio-button>
      <el-radio-button label="preview">
        HTML
      </el-radio-button>
    </el-radio-group>
    <el-autocomplete
      v-if="$store.state.fileSearchBoxVisible"
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
  </section>
</template>

<script>
import Vue from 'vue';
import settings from '@config/settings.json';
import Note from '@scripts/note/note.js';
import NoteUtil from '@scripts/note/note-util.js';

export default {
  data() {
    return {
      mode: this.$store.state.mode,
      filePath: '',
      treeData: []
    };
  },
  computed: {
    fileName() {
      if (this.$store.state.currentFile) {
        return new Note(this.$store.state.currentFile).readTitle();
      }
      return 'Untitled';
    }
  },
  mounted() {
    const notes = NoteUtil.readTree(settings.directory);
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

    this.$store.watch(
      (state) => state.mode,
      (newValue, oldValue) => {
        this.mode = newValue
      }
    )
  },
  methods: {
    changeViewMode() {
      this.$store.commit('changeMode', this.mode);
    },

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
      this.$store.commit('changeMode', 'preview');
    }
  }
}
</script>

<style scoped>
  #toolbar {
    background-color: #4a4a4a;
  }

  .file-name {
    display: flex;
    align-items: center;
    margin: 0 15px;
    height: 50px;
    color: #fff;
  }

  .file-name div {
    font-size: 18px;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .checkbox-mode {
    position: absolute;
    top: 11px;
    right: 15px;
  }
</style>

<style lang="scss">
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
