<template>
  <el-dialog
    v-model:visible="$store.state.visibleLinkDialog"
    title="Hyperlink"
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
        <el-input ref="linkUrlInput" v-model="linkUrl" placeholder="Please input" @keyup.enter.native="insertLink" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">Cancel</el-button>
      <el-button type="primary" @click="insertLink">Insert</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import setting from '@/config/setting'
import axios from 'axios'
const API_KEY = process.env.VUE_APP_MELT_API_KEY

interface DataType {
  linkTitle: string
  linkUrl: string
}

export default defineComponent({
  data() {
    const data: DataType = {
      linkTitle: '',
      linkUrl: '',
    }
    return data
  },

  methods: {
    openDialog() {
      const text = this.$store.state.editor.getSelection()
      if (text) {
        try {
          // eslint-disable-next-line no-new
          new URL(text)
          this.linkUrl = text
          const url = `${setting.api}/sites/meta?url=${this.linkUrl}&api_key=${API_KEY}`
          axios.get(url).then((res) => {
            if (this.linkTitle === '' && this.$store.state.visibleLinkDialog === true) {
              this.linkTitle = res.data.title
            }
          })
          this.$nextTick().then(() => {
            // @ts-ignore
            this.$refs.linkTitleInput.$refs.input.focus()
          })
        } catch (e) {
          this.linkTitle = text
          this.$nextTick().then(() => {
            // @ts-ignore
            this.$refs.linkUrlInput.$refs.input.focus()
          })
        }
      } else {
        this.$nextTick().then(() => {
          // @ts-ignore
          this.$refs.linkTitleInput.$refs.input.focus()
        })
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
})
</script>
