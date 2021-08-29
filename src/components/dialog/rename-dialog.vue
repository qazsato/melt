<template>
  <el-dialog
    title="Rename"
    :visible.sync="$store.state.visibleRenameDialog"
    :close-on-click-modal="false"
    width="400px"
    :before-close="closeDialog"
    @open="openDialog"
  >
    <el-input
      ref="fileNameInput"
      v-model="fileName"
      placeholder="Please input"
      @keyup.enter.native="changeFileName"
    >
      <template slot="append"> .md </template>
    </el-input>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        :disabled="isDisabledChange"
        @click="changeFileName"
      >
        Change
      </el-button>
      <el-button @click="closeDialog"> Cancel </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      fileName: '',
    }
  },

  computed: {
    isDisabledChange() {
      return this.fileName.length === 0
    },
  },

  methods: {
    openDialog() {
      this.fileName = this.$store.state.note.title.split('.md')[0]
      this.$nextTick().then(() => this.$refs.fileNameInput.$refs.input.focus())
    },

    closeDialog() {
      this.$store.commit('hideRenameDialog')
    },

    changeFileName() {
      if (this.isDisabledChange) {
        return
      }
      const note = this.$store.state.note
      const regexp = new RegExp(`${note.fileName}$`) // 末尾の文字列のみ置換対象とする
      const path = note.filePath.replace(regexp, `${this.fileName}.md`)
      this.$store.commit('renameNote', path)
      this.closeDialog()
    },
  },
}
</script>
