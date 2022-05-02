<template>
  <el-dialog
    v-model:visible="$store.state.visibleRenameDialog"
    title="Rename"
    :close-on-click-modal="false"
    width="400px"
    :before-close="closeDialog"
    @open="openDialog"
  >
    <el-input ref="fileNameInput" v-model="fileName" placeholder="Please input" @keyup.enter.native="changeFileName">
      <template #append> .md </template>
    </el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">Cancel</el-button>
      <el-button type="primary" :disabled="isDisabledChange" @click="changeFileName">Change</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface DataType {
  fileName: string
}

export default defineComponent({
  data() {
    const data: DataType = {
      fileName: '',
    }
    return data
  },

  computed: {
    isDisabledChange() {
      // @ts-ignore
      return this.fileName.length === 0
    },
  },

  methods: {
    openDialog() {
      this.fileName = this.$store.state.note.title.split('.md')[0]
      this.$nextTick().then(() => {
        // @ts-ignore
        this.$refs.fileNameInput.$refs.input.focus()
      })
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
})
</script>
