<template>
  <div class="container">
    <div class="input-area">
      <h1 class="file-name">
        <i class="icon-file"></i>
        <el-tooltip :content="this.$store.state.currentFile" :open-delay="1000">
          <div>{{fileName}}</div>
        </el-tooltip>
      </h1>
      <el-autocomplete
        class="filter-input"
        placeholder="Search"
        v-model="filterText"
        prefix-icon="el-icon-search"
        size="small"
        ref="search"
        :fetch-suggestions="querySearch"
        @select="handleInput"
      ></el-autocomplete>
    </div>
    <div class="tree-area">
      <el-tree class="file-tree" :data="this.$store.state.treeDatas" @node-click="handleNodeClick" :filter-node-method="filterNode" ref="filetree" :highlight-current="true"></el-tree>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import {ipcRenderer} from 'electron';
import fs from 'fs';
import path from 'path';
import Note from '../assets/scripts/note.js';
import NoteUtil from '../assets/scripts/note-util.js';

export default {
  data() {
    return {
      filterText: '',
      path: '',
      name: ''
    };
  },
  computed: {
    fileName() {
      if (!this.$store.state.currentFile) return;
      const title = new Note(this.$store.state.currentFile).readTitle();
      return title || 'Untitled';
    }
  },
  watch: {
    filterText(val) {
      this.$refs.filetree.filter(val);
    }
  },
  mounted() {
    this.$store.commit('updateTreeDatas');
    ipcRenderer.on('focus-search', () => {
      // サイドバー非表示時は検索ボックスのフォーカスが効かないためタイミングをずらす
      Vue.nextTick().then(() => this.$refs.search.$refs.input.focus());
    });
    const file = NoteUtil.getRecentPath();
    this.$store.commit('changeCurrentFile', file);
  },
  methods: {
    handleNodeClick(data) {
      if(fs.statSync(data.path).isDirectory()) return;
      this.$store.commit('changeCurrentFile', data.path);
    },
    filterNode(value, data) {
      if (!value) return true;
      value = value.toLowerCase();
      const note = new Note(data.path);
      if (value.startsWith('#')) {
        const tags = note.readTag().toString().toLowerCase();
        return tags.includes(value.split('#')[1]);
      }
      const content = note.readContent().toLowerCase();
      return content.includes(value);
    },
    querySearch(queryString, cb) {
      let results = [];
      if (queryString.startsWith('#')) {
        const filterText = queryString.split('#')[1];
        results = filterText ? this.$store.state.suggestDatas.filter(this.createFilter(filterText)) : this.$store.state.suggestDatas;
      }
      cb(results);
    },
    createFilter(filterText) {
      return (d) => {
        return (d.value.toLowerCase().indexOf(filterText.toLowerCase()) === 0);
      };
    },
    handleInput(data) {
      this.filterText = `#${data.value}`;
    }
  }
}
</script>

<style>
  .tree-area .el-tree-node:focus>.el-tree-node__content,
  .tree-area .el-tree-node__content:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .tree-area .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: rgba(0, 0, 0, 0.2);
  }
</style>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
    background-color: #4a4a4a;
  }

  .input-area {
    height: 100px;
  }

  .tree-area {
    height: calc(100% - 100px);
    overflow-y: auto;
  }

  .file-name {
    display: flex;
    align-items: center;
    margin: 0 10px;
    height: 50px;
    color: #fff;
  }

  .file-name .icon-file {
    margin-right: 5px;
    font-size: 22px;
  }

  .file-name div {
    font-size: 18px;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .filter-input {
    margin: 4px 10px;
    width: calc(100% - 20px);
  }

  .file-tree {
    color: #fff;
    background-color: #4a4a4a;
  }
</style>
