<template>
  <el-dialog
    v-model="$store.state.visibleLinkDialog"
    title="Hyperlink"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    width="400px"
    @open="openDialog"
  >
    <el-form label-width="45px">
      <el-form-item label="Title">
        <el-input ref="linkTitleInput" v-model="linkTitle" placeholder="Please input" @keyup.enter="insertLink" />
      </el-form-item>
      <el-form-item label="URL">
        <el-input ref="linkUrlInput" v-model="linkUrl" placeholder="Please input" @keyup.enter="insertLink" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="insertLink">Insert</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface DataType {
  linkTitle: string
  linkUrl: string
}

export default defineComponent({
  emits: ['insert'],

  data() {
    const data: DataType = {
      linkTitle: '',
      linkUrl: '',
    }
    return data
  },

  methods: {
    openDialog() {
      setTimeout(() => {
        // @ts-ignore
        this.$refs.linkTitleInput.focus()
      })
    },

    closeDialog() {
      this.linkTitle = ''
      this.linkUrl = ''
      this.$store.commit('hideLinkDialog')
    },

    insertLink() {
      this.$emit('insert', this.linkTitle, this.linkUrl)
      this.closeDialog()
    },
  },
})
</script>
