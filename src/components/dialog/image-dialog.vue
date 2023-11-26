<template>
  <el-dialog
    v-model="$store.state.visibleImageDialog"
    title="Image"
    :close-on-click-modal="false"
    width="400px"
    :before-close="closeDialog"
    @open="openDialog"
  >
    <el-form label-width="45px">
      <el-form-item label="Alt">
        <el-input ref="imageAltInput" v-model="imageAlt" placeholder="Please input" @keyup.enter="insertImage" />
      </el-form-item>
      <el-form-item label="URL">
        <el-input ref="imageUrlInput" v-model="imageUrl" placeholder="Please input" @keyup.enter="insertImage" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="insertImage">Insert</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface DataType {
  imageAlt: string
  imageUrl: string
}

export default defineComponent({
  emits: ['insert'],

  data() {
    const data: DataType = {
      imageAlt: '',
      imageUrl: '',
    }
    return data
  },

  methods: {
    openDialog() {
      setTimeout(() => {
        // @ts-ignore
        this.$refs.imageAltInput.focus()
      })
    },

    closeDialog() {
      this.imageAlt = ''
      this.imageUrl = ''
      this.$store.commit('hideImageDialog')
    },

    insertImage() {
      this.$emit('insert', this.imageAlt, this.imageUrl)
      this.closeDialog()
    },
  },
})
</script>
