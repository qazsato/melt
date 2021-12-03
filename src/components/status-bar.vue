<template>
  <section class="status-bar" :class="theme">
    <div class="paragraph">
      <span>¶ </span>
      <span>{{ paragraph }}</span>
    </div>
    <div class="line">
      <span>L </span>
      <span>{{ line }}</span>
    </div>
    <div class="spacer" />
    <div v-if="lastModifiedAt" class="last-modified">
      <i class="el-icon-refresh" />
      <span>{{ lastModifiedAt }}</span>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'

interface DataType {
  paragraph: number
  line: number
  lastModifiedAt: string | null
}

export default Vue.extend({
  data() {
    const data: DataType = {
      paragraph: 0,
      line: 0,
      lastModifiedAt: null,
    }
    return data
  },

  computed: {
    theme() {
      return this.$store.state.preference.theme
    },

    isChanged() {
      return this.$store.state.note.isChanged
    },

    content() {
      return this.$store.state.note.content
    },
  },

  watch: {
    isChanged() {
      const note = this.$store.state.note
      if (note.fileStats) {
        this.lastModifiedAt = dayjs(note.fileStats.mtime).format('YYYY/MM/DD HH:mm:ss')
      }
    },

    content(value) {
      const note = this.$store.state.note
      this.paragraph = note.tableOfContents.length
      this.line = value.split('\n').length
      this.lastModifiedAt = note.fileStats ? dayjs(note.fileStats.mtime).format('YYYY/MM/DD HH:mm:ss') : null
    },
  },
})
</script>

<style lang="scss" scoped>
.status-bar {
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 100%;
  font-size: 11px;

  &.melt-light {
    background-color: #f6f8fa;
    color: #24292e;
  }

  &.melt-dark {
    background-color: #4a4a4a;
    color: #c9d1d9;
  }
}

.spacer {
  flex: 1;
}

.paragraph,
.line {
  margin-right: 5px;
}
</style>
