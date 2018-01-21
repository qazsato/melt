<template>
  <div class="container">
    <div class="input-area">
      <h1 class="file-name">
        <i class="icon-file"></i>
        <div>{{fileName}}</div>
      </h1>
      <el-input class="filter-input" placeholder="Filter keyword" v-model="filterText" prefix-icon="el-icon-search" size="small"></el-input>
    </div>
    <div class="tree-area">
      <el-tree class="file-tree" :data="treeDatas" @node-click="handleNodeClick" :filter-node-method="filterNode" ref="filetree" :highlight-current="true"></el-tree>
    </div>
  </div>
</template>

<script>
import FileUtil from '../scripts/FileUtil';
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
    const dir = '/Users/kazuki-sato/Dropbox/notes';
    FileUtil.readTree(dir).then((t) => this.treeDatas = t);
  },
  methods: {
    handleNodeClick(data) {
      if(fs.statSync(data.path).isDirectory()) return;
      this.$store.commit('changeCurrentFile', data.path);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
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
    height: 90px;
  }

  .tree-area {
    height: calc(100% - 90px);
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
