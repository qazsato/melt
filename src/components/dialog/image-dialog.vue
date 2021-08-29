<template>
  <el-dialog
    title="Image"
    :visible.sync="$store.state.visibleImageDialog"
    :close-on-click-modal="false"
    width="400px"
    :before-close="closeDialog"
    @open="openDialog"
  >
    <el-form label-width="45px">
      <el-form-item label="Alt">
        <el-input
          ref="imageAltInput"
          v-model="imageAlt"
          placeholder="Please input"
          @keyup.enter.native="insertImage"
        />
      </el-form-item>
      <el-form-item label="URL">
        <el-input
          ref="imageUrlInput"
          v-model="imageUrl"
          placeholder="Please input"
          @keyup.enter.native="insertImage"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="insertImage"> Insert </el-button>
      <el-button @click="closeDialog"> Cancel </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      imageAlt: '',
      imageUrl: '',
    }
  },

  methods: {
    openDialog() {
      const text = this.$store.state.editor.getSelection()
      if (text) {
        try {
          // eslint-disable-next-line no-new
          new URL(text)
          this.imageUrl = text
          this.$nextTick().then(() =>
            this.$refs.imageAltInput.$refs.input.focus()
          )
        } catch (e) {
          this.imageAlt = text
          this.$nextTick().then(() =>
            this.$refs.imageUrlInput.$refs.input.focus()
          )
        }
      } else {
        this.$nextTick().then(() =>
          this.$refs.imageAltInput.$refs.input.focus()
        )
      }
    },

    closeDialog() {
      this.imageAlt = ''
      this.imageUrl = ''
      this.$store.state.editor.focus()
      this.$store.commit('hideImageDialog')
    },

    insertImage() {
      this.$store.state.editor.insertImage(this.imageAlt, this.imageUrl)
      this.closeDialog()
    },
  },
}
</script>
