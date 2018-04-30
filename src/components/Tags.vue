<template>
  <section>
    <el-tag
      :key="tag"
      v-for="tag in dynamicTags"
      closable
      type="info"
      size="small"
      :disable-transitions="true"
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
import Note from '../assets/scripts/note.js';

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
    const tags = Note.readAllTags();
    this.links = tags.map((t) => {
      return {value: t}
    });
  },
  methods: {
    querySearch(queryString, cb) {
      const results = queryString ? this.links.filter(this.createFilter(queryString)) : this.links;
      cb(results);
    },
    createFilter(queryString) {
      return (link) => {
        return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleClose(tag) {
      this.$store.state.note.removeTag(tag);
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
        if (this.links.filter((d) => d.value === inputValue).length === 0) {
          this.links.push({value: inputValue});
        }
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    blurInput() {
      setTimeout(() => this.inputVisible = false, 500);
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
