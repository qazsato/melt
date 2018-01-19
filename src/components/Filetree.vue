<template>
  <div class="container">
    <el-input class="filter-input" placeholder="Filter keyword" v-model="filterText" prefix-icon="el-icon-search" size="small"></el-input>
    <el-tree class="file-tree" :data="data" @node-click="handleNodeClick" :filter-node-method="filterNode" ref="filetree" :highlight-current="true"></el-tree>
  </div>
</template>

<script>
export default {
  watch: {
    filterText(val) {
      this.$refs.filetree.filter(val);
    }
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
      data: [{
        label: 'Level one 1',
        children: [{
          label: 'Level two 1-1',
          children: [{
            label: 'Level three 1-1-1'
          }]
        }]
      }, {
        label: 'Level one 2',
        children: [{
          label: 'Level two 2-1',
          children: [{
            label: 'Level three 2-1-1'
          }]
        }, {
          label: 'Level two 2-2',
          children: [{
            label: 'Level three 2-2-1'
          }]
        }]
      }, {
        label: 'Level one 3',
        children: [{
          label: 'Level two 3-1',
          children: [{
            label: 'Level three 3-1-1'
          }]
        }, {
          label: 'Level two 3-2',
          children: [{
            label: 'Level three 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
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
    border-top: 1px solid #313131;
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
