<template>
  <el-dialog
    title="Hyperlink"
    :visible.sync="$store.state.visibleLinkDialog"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    width="400px"
    @open="openDialog"
  >
    <el-form label-width="45px">
      <el-form-item label="Title">
        <el-input
          ref="linkTitleInput"
          v-model="linkTitle"
          placeholder="Please input"
          @keyup.enter.native="insertLink"
        />
      </el-form-item>
      <el-form-item label="URL">
        <el-input
          ref="linkUrlInput"
          v-model="linkUrl"
          placeholder="Please input"
          @keyup.enter.native="insertLink"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="insertLink"> Insert </el-button>
      <el-button @click="closeDialog"> Cancel </el-button>
    </span>
  </el-dialog>
</template>

<script>
import setting from '@config/setting.json'
import axios from 'axios'

export default {
  data() {
    return {
      linkTitle: '',
      linkUrl: '',
    }
  },

  methods: {
    openDialog() {
      const text = this.$store.state.editor.getSelection()
      if (text) {
        try {
          // eslint-disable-next-line no-new
          new URL(text)
          this.linkUrl = text
          const url = `${setting.api}/sites/metadata?url=${this.linkUrl}`
          axios.get(url).then((res) => {
            if (
              this.linkTitle === '' &&
              this.$store.state.visibleLinkDialog === true
            ) {
              this.linkTitle = res.data.title
            }
          })
          this.$nextTick().then(() =>
            this.$refs.linkTitleInput.$refs.input.focus()
          )
        } catch (e) {
          this.linkTitle = text
          this.$nextTick().then(() =>
            this.$refs.linkUrlInput.$refs.input.focus()
          )
        }
      } else {
        this.$nextTick().then(() =>
          this.$refs.linkTitleInput.$refs.input.focus()
        )
      }
    },

    closeDialog() {
      this.linkTitle = ''
      this.linkUrl = ''
      this.$store.state.editor.focus()
      this.$store.commit('hideLinkDialog')
    },

    insertLink() {
      this.$store.state.editor.insertLink(this.linkTitle, this.linkUrl)
      this.closeDialog()
    },
  },
}
</script>
