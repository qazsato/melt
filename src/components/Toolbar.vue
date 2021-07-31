<template>
  <section id="toolbar">
    <el-radio-group
      v-model="mode"
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
  data() {
    return {
      mode: this.$store.state.mode
    };
  },
  methods: {
    changeViewMode() {
      this.$store.commit('changeMode', this.mode);
    }
  }
}
</script>

<style scoped>
  #toolbar {
    height: 50px;
    background-color: #4a4a4a;
  }

  .checkbox-mode {
    position: absolute;
    top: 11px;
    right: 15px;
  }
</style>
