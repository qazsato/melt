<template>
  <section class="status-bar">
    <div class="paragraph">
      <span>¶ </span>
      <span>{{ paragraph }}</span>
    </div>
    <div class="line">
      <span>L </span>
      <span>{{ line }}</span>
    </div>
    <div class="spacer" />
    <div
      v-if="lastModifiedAt"
      class="last-modified"
    >
      <i class="el-icon-refresh" />
      <span>{{ lastModifiedAt }}</span>
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'

export default {
  data () {
    return {
      paragraph: 0,
      line: 0,
      lastModifiedAt: null
    }
  },

  computed: {
    isChanged () {
      return this.$store.state.note.isChanged
    },

    content () {
      return this.$store.state.note.content
    }
  },

  watch: {
    isChanged () {
      const note = this.$store.state.note
      if (note.fileStats) {
        this.lastModifiedAt = dayjs(note.fileStats.mtime).format('YYYY/MM/DD HH:mm:ss')
      }
    },

    content (value) {
      const note = this.$store.state.note
      this.paragraph = note.tableOfContents.length
      this.line = value.split('\n').length
      this.lastModifiedAt = note.fileStats ? dayjs(note.fileStats.mtime).format('YYYY/MM/DD HH:mm:ss') : null
    }
  }
}
</script>

<style lang="scss" scoped>
.status-bar {
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 100%;
  background-color: #f6f8fa;
  color: #24292e;
  font-size: 11px;
}

.spacer {
  flex: 1;
}

.paragraph,
.line {
  margin-right: 5px;
}
</style>
