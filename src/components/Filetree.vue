<template>
  <div class="container">
    <div class="input-area">
      <h1 class="file-name">
        <i class="icon-file"></i>
        <el-tooltip :content="this.$store.state.currentFile" :open-delay="1000">
          <div>{{fileName}}</div>
        </el-tooltip>
      </h1>
      <el-input class="filter-input" placeholder="Filter keyword" v-model="filterText" prefix-icon="el-icon-search" size="small"></el-input>
      <div class="button-area">
        <i class="icon-new_file" @click="createFile"></i>
        <i class="icon-new_folder" @click="createFolder"></i>
        <i class="icon-sync" @click="loadTree"></i>
      </div>
    </div>
    <div class="tree-area">
      <el-tree class="file-tree" :data="treeDatas" @node-click="handleNodeClick" :filter-node-method="filterNode" ref="filetree" :highlight-current="true"></el-tree>
    </div>
  </div>
</template>

<script>
import settings from '../../config/settings.json';
import FileUtil from '../assets/scripts/FileUtil';
import fs from 'fs';
import path from 'path';

export default {
  data() {
    return {
      filterText: '',
      treeDatas: []
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
    this.loadTree();
  },
  methods: {
    handleNodeClick(data) {
      if(fs.statSync(data.path).isDirectory()) return;
      this.$store.commit('changeCurrentFile', data.path);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    createFile() {
      console.log('file');
    },
    createFolder() {
      console.log('folder');
    },
    loadTree() {
      FileUtil.readTree(settings.directory).then((t) => this.treeDatas = t);
    }
  }
}
</script>

<style>
  .el-tree-node:focus>.el-tree-node__content,
  .el-tree-node__content:hover {
    background-color: inherit;
  }

  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: inherit;
    opacity: 0.4;
  }
</style>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
    background-color: #4a4a4a;
  }

  .input-area {
    height: 115px;
  }

  .tree-area {
    height: calc(100% - 115px);
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

  .button-area {
    text-align: right;
    margin: 5px 10px 0 0;
  }

  .button-area > i {
    cursor: pointer;
    color: #ddd;
  }

  .button-area > i:hover {
    color: #fff;
  }

  .file-tree {
    color: #fff;
    background-color: #4a4a4a;
  }
</style>
