<template>
  <section>
    <el-tag
      v-for="(tag, index) in dynamicTags"
      :key="index"
      closable
      type="info"
      size="small"
      :disable-transitions="true"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <el-autocomplete
      v-if="inputVisible"
      ref="saveTagInput"
      v-model="inputValue"
      class="input-new-tag"
      :fetch-suggestions="querySearch"
      size="mini"
      @keyup.enter.native="handleInput"
      @select="handleInput"
      @blur="blurInput"
    />
    <el-button
      v-else
      class="button-new-tag"
      size="mini"
      @click="showInput"
    >
      + New Tag
    </el-button>
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
  computed: {
    file() {
      return this.$store.state.currentFile;
    }
  },
  watch: {
    file(file) {
      if (!file) return;
      this.dynamicTags = this.$store.state.note.readTag();
    }
  },
  mounted() {
    this.$store.commit('updateSuggestDatas');
  },
  methods: {
    querySearch(queryString, cb) {
      const results = queryString ? this.$store.state.suggestDatas.filter(this.createFilter(queryString)) : this.$store.state.suggestDatas;
      cb(results);
    },
    createFilter(queryString) {
      return (d) => {
        return (d.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleClose(tag) {
      this.$store.state.note.removeTag(tag);
      this.$store.commit('updateSuggestDatas');
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInput(item) {
      const tags = this.$store.state.note.readTag();
      let inputValue = item.value || this.inputValue;
      if (inputValue && !tags.includes(inputValue)) {
        this.$store.state.note.registTag(inputValue);
        if (this.$store.state.suggestDatas.filter((d) => d.value === inputValue).length === 0) {
          this.$store.commit('updateSuggestDatas');
        }
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    blurInput() {
      // TODO: サジェストからの項目が選択出来ない事象が発生しているため暫定的にコメントアウトする
      // Vue.nextTick().then(() => this.inputVisible = false);
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
  .el-button.button-new-tag {
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
