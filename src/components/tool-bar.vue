<template>
  <section class="tool-bar">
    <h1 class="file-name">
      <template v-if="$store.state.note.filePath">
        <el-tooltip
          :content="$store.state.note.filePath"
          :open-delay="200"
        >
          <div>{{ $store.state.note.title }}</div>
        </el-tooltip>
      </template>
      <template v-else>
        <div>{{ $store.state.note.title }}</div>
      </template>
      <span
        v-if="isSaved === false"
        class="unsaved"
      >*</span>
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
export default {
  computed: {
    viewMode () {
      return this.$store.state.viewMode
    },

    isSaved () {
      return this.$store.state.note.isSaved
    }
  },

  methods: {
    changeViewMode () {
      this.$store.commit('changeViewMode', this.viewMode)
    }
  }
}
</script>

<style lang="scss" scoped>
.tool-bar {
  position: relative;
  background-color: #4a4a4a;

  .file-name {
    display: flex;
    align-items: center;
    margin: 0 15px;
    height: 50px;
    color: #fff;

    div {
      font-size: 18px;
      font-weight: bold;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .unsaved {
    padding-top: 9px;
    padding-left: 5px;
  }

  .checkbox-mode {
    position: absolute;
    top: 12px;
    right: 15px;
  }
}
</style>

<style lang="scss">
#toolbar {
  .checkbox-mode {
    .el-radio-button__inner {
      padding: 6px 10px;
    }
  }
}
</style>
