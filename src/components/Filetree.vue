<template>
  <div class="container">
    <el-input class="filter-input" placeholder="Filter keyword" v-model="filterText" prefix-icon="el-icon-search" size="small"></el-input>
    <el-tree class="file-tree" :data="treeDatas" @node-click="handleNodeClick" :filter-node-method="filterNode" ref="filetree" :highlight-current="true"></el-tree>
  </div>
</template>

<script>
import FileUtil from '../scripts/FileUtil';

export default {
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
      console.log(data);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  },
  data() {
    return {
      filterText: '',
      treeDatas: []
    };
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

  .filter-input {
    margin: 10px;
    width: calc(100% - 20px);
  }

  .file-tree {
    color: #fff;
    background-color: #4a4a4a;
  }
</style>
