<template>
  <section>
    <el-tag
      :key="tag"
      v-for="tag in dynamicTags"
      closable
      size="small"
      :disable-transitions="false"
      @close="handleClose(tag)">
      {{tag}}
    </el-tag>
    <el-autocomplete
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      :fetch-suggestions="querySearch"
      ref="saveTagInput"
      size="mini"
      @keyup.enter.native="handleInput"
      @select="handleInput"
      @blur="blurInput"
    ></el-autocomplete>
    <el-button v-else class="button-new-tag" size="mini" @click="showInput">+ New Tag</el-button>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        dynamicTags: [],
        inputVisible: false,
        inputValue: ''
      };
    },
    methods: {
      querySearch(queryString, cb) {
        var links = [
          { "value": "vue", "link": "https://github.com/vuejs/vue" },
          { "value": "element", "link": "https://github.com/ElemeFE/element" },
          { "value": "cooking", "link": "https://github.com/ElemeFE/cooking" },
          { "value": "mint-ui", "link": "https://github.com/ElemeFE/mint-ui" },
          { "value": "vuex", "link": "https://github.com/vuejs/vuex" },
          { "value": "vue-router", "link": "https://github.com/vuejs/vue-router" },
          { "value": "babel", "link": "https://github.com/babel/babel" }
        ];
        var results = queryString ? links.filter(this.createFilter(queryString)) : links;
        cb(results);
      },
      createFilter(queryString) {
        return (link) => {
          return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInput(item) {
        let inputValue = item.value || this.inputValue;
        if (inputValue && !this.dynamicTags.includes(inputValue)) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      blurInput() {
        setTimeout(() => this.inputVisible = false, 100);
      }
    }
  }
</script>

<style scoped>
  section {
    height: 40px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    overflow-x: auto;
    border-bottom: 1px solid #ebeef5;
  }
</style>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    width: 100px;
    margin-left: 10px;
    height: 24px;
    line-height: 22px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 100px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .input-new-tag .el-input__inner {
    height: 24px;
  }
  .el-autocomplete-suggestion li {
    padding: 0 10px;
  }
</style>
