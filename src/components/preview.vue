<template>
  <div v-show="isViewModePreview" class="preview-area" :class="theme">
    <!-- eslint-disable vue/no-v-html -->
    <article ref="markdown" class="markdown-body" v-html="markedText" />
    <!-- eslint-enable vue/no-v-html -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Markdown from '@/assets/scripts/markdown/markdown'
import '@/assets/styles/preview/markdown.scss'
import { VIEW_MODE } from '@/constants'

interface DataType {
  markdown: Markdown
  markedText: string
}

export default defineComponent({
  name: 'MeltPreview',
  data() {
    const data: DataType = {
      markdown: new Markdown(),
      markedText: '',
    }
    return data
  },

  computed: {
    theme() {
      return this.$store.state.preference.theme
    },

    content() {
      return this.$store.state.note.content
    },

    isViewModePreview() {
      return this.$store.state.viewMode === VIEW_MODE.PREVIEW
    },
  },

  watch: {
    isViewModePreview() {
      if (!this.isViewModePreview) {
        return
      }
      this.draw()
    },

    content() {
      if (!this.isViewModePreview) {
        return
      }
      this.draw()
    },
  },

  methods: {
    draw() {
      this.markedText = this.markdown.render(this.content)
      setTimeout(() => {
        const element = this.$refs.markdown as HTMLElement
        const cbElements = element.querySelectorAll('.clipboard')
        cbElements.forEach((e) => e.addEventListener('click', this.copyClipboard))
      })
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    copyClipboard(event: any) {
      const code = event.target.nextElementSibling.innerText.trim() // コピーボタンの隣接要素(=codeタグ)のテキスト情報を取得
      navigator.clipboard.writeText(code).then(() => {
        // @ts-ignore
        this.$message({ type: 'success', message: 'Copied to clipboard', showClose: true })
      })
    },
  },
})
</script>

<style lang="scss" scoped>
.preview-area {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
</style>
