<template>
  <section id="toolbar">
    <h1 class="file-name">
      <el-tooltip
        :content="$store.state.currentFile"
        :open-delay="1000"
      >
        <div>{{ fileName }}</div>
      </el-tooltip>
    </h1>

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
import Note from '@scripts/note/note.js';
import NoteUtil from '@scripts/note/note-util.js';

export default {
  data() {
    return {
      mode: this.$store.state.mode
    };
  },
  computed: {
    fileName() {
      if (!this.$store.state.currentFile) return;
      const title = new Note(this.$store.state.currentFile).readTitle();
      return title || 'Untitled';
    }
  },
  mounted() {
    const file = NoteUtil.getRecentPath();
    this.$store.commit('changeCurrentFile', file);
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
