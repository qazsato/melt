<template>
  <div
    v-show="isViewModePreview"
    class="preview-area"
  >
    <!-- eslint-disable vue/no-v-html -->
    <article
      ref="markdown"
      class="markdown-body"
      v-html="markedText"
    />
    <!-- eslint-enable vue/no-v-html -->
  </div>
</template>

<script>
import Markdown from '@/assets/scripts/markdown/markdown'
import '@/assets/styles/markdown.scss'
import { VIEW_MODE } from '@/constants'

export default {
  computed: {
    content () {
      return this.$store.state.note.content
    },

    isViewModePreview () {
      return this.$store.state.viewMode === VIEW_MODE.PREVIEW
    },

    markedText () {
      return this.markdown.render(this.content)
    }
  },

  watch: {
    content () {
      this.$nextTick().then(() => {
        const cbElements = this.$refs.markdown.querySelectorAll('.clipboard')
        cbElements.forEach((e) => e.addEventListener('click', this.copyClipboard))
      })
    }
  },

  created () {
    this.markdown = new Markdown()
  },

  methods: {
    copyClipboard (event) {
      const code = event.target.nextElementSibling.innerText.trim() // コピーボタンの隣接要素(=codeタグ)のテキスト情報を取得
      navigator.clipboard.writeText(code).then(() => {
        this.$message({ type: 'success', message: 'Copy to clipboard.', showClose: true })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-area {
  flex: 1;
  min-width: 50%;
  height: 100%;
  overflow-y: scroll;
  border-left: 1px solid #ebeef5;
}
</style>
