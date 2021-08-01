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
      v-model="viewMode"
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
  </section>
</template>

<script>
import Note from '@scripts/note/note.js';

export default {
  data() {
    return {
      viewMode: this.$store.state.viewMode
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
    this.$store.watch(
      (state) => state.viewMode,
      (newValue, oldValue) => {
        this.viewMode = newValue
      }
    )
  },
  methods: {
    changeViewMode() {
      this.$store.commit('changeViewMode', this.viewMode);
    }
  }
}
</script>

<style lang="scss" scoped>
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
