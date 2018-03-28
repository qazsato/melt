<template>
  <div class="container">
    <div class="input-area">
      <h1 class="file-name">
        <i class="icon-file"></i>
        <el-tooltip :content="this.$store.state.currentFile" :open-delay="1000">
          <div>{{fileName}}</div>
        </el-tooltip>
      </h1>
      <el-input class="filter-input" placeholder="Search" v-model="filterText" prefix-icon="el-icon-search" size="small" ref="search"></el-input>
    </div>
    <div class="tree-area">
      <el-tree class="file-tree" :data="treeDatas" @node-click="handleNodeClick" :filter-node-method="filterNode" ref="filetree" :highlight-current="true"></el-tree>
    </div>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron';
import settings from '../../config/settings.json';
import FileUtil from '../assets/scripts/FileUtil';
import fs from 'fs';
import path from 'path';
import Note from '../assets/scripts/Note';

export default {
  data() {
    return {
      filterText: '',
      treeDatas: [],
      path: '',
      name: ''
    };
  },
  computed: {
    fileName() {
      return path.basename(this.$store.state.currentFile);
    }
  },
  watch: {
    filterText(val) {
      this.$refs.filetree.filter(val);
    }
  },
  mounted() {
    FileUtil.readTree(settings.directory).then((t) => this.treeDatas = t);
    ipcRenderer.on('focus-search', () => {
      // サイドバー非表示時は検索ボックスのフォーカスが効かないためタイミングをずらす
      setTimeout(() => this.$refs.search.$refs.input.focus());
    });
    const file = Note.getRecentPath();
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
      const label = data.label.toLowerCase();
      if(fs.statSync(data.path).isDirectory()) {
        return label.indexOf(value) !== -1;
      } else {
        const note = new Note(data.path);
        const content = note.readContent();
        return content.includes(value);
      }
    }
  }
}
</script>

<style>
  .el-tree-node:focus>.el-tree-node__content,
  .el-tree-node__content:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
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
