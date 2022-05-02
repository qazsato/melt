<template>
  <el-dialog
    v-model:visible="$store.state.visibleFindParagraphDialog"
    :show-close="false"
    :lock-scroll="false"
    custom-class="find-paragraph-dialog"
    width="400px"
    :before-close="closeDialog"
    @open="openDialog"
  >
    <el-autocomplete
      ref="paragraphInput"
      v-model="paragraphText"
      class="autocomplete"
      popper-class="find-paragraph-popper"
      :fetch-suggestions="queryFindParagraph"
      placeholder="Find paragraph in note"
      :highlight-first-item="true"
      :popper-append-to-body="false"
      @keyup.native="onKeyup"
      @select="onSelect"
    >
      <template #default="{ item }">
        <div class="item">
          <div class="heading">H{{ item.heading }}</div>
          <div class="text" :class="`heading-${item.heading}`">
            {{ item.text }}
          </div>
        </div>
      </template>
    </el-autocomplete>
  </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { TableOfContent } from '@/assets/scripts/note/note'
import { VIEW_MODE } from '@/constants'

interface Suggestion {
  text: string
  heading: number
  index: number
}

interface DataType {
  paragraphText: string
  tableOfContents: TableOfContent[]
  suggestions: Suggestion[]
  isComposing: boolean
}

export default Vue.extend({
  data() {
    const data: DataType = {
      paragraphText: '',
      tableOfContents: [],
      suggestions: [],
      isComposing: false, // 日本語入力(IME)が未確定か否か
    }
    return data
  },

  computed: {
    visibleFindParagraphDialog() {
      return this.$store.state.visibleFindParagraphDialog
    },
  },

  watch: {
    visibleFindParagraphDialog(value) {
      if (value) {
        this.$nextTick().then(() => {
          // @ts-ignore
          this.$refs.paragraphInput.$refs.input.focus()
        })
      }
    },
  },

  methods: {
    queryFindParagraph(query: string, callback: (suggestion: Suggestion[]) => void) {
      const filteredParagraphs = query
        ? this.tableOfContents.filter((t) => t.text.toLowerCase().includes(query.toLowerCase()))
        : this.tableOfContents
      this.suggestions = filteredParagraphs.map((t, i) => {
        return {
          text: t.text,
          heading: t.heading,
          index: i,
        }
      })
      callback(this.suggestions)
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onKeyup(e: any) {
      this.isComposing = e.isComposing
    },

    onSelect(item: Suggestion) {
      // HACK: イベント処理順を keyup => select としたいためタイミングをずらしている
      setTimeout(() => {
        if (this.isComposing) {
          return
        }
        let i = 0
        const tocs = this.tableOfContents.slice(0, item.index)
        tocs.forEach((t) => {
          if (t.heading === item.heading) i++
        })
        this.$store.commit('changeViewMode', VIEW_MODE.PREVIEW)
        this.$store.commit('hideFindParagraphDialog')
        // ビューモード切り替え直後のスクロール移動だと移動しないためタイミングをずらしている
        setTimeout(() => document.getElementsByTagName(`h${item.heading}`)[i].scrollIntoView())
      })
    },

    openDialog() {
      this.tableOfContents = this.$store.state.note.tableOfContents
      // HACK: closeDialogで消えたままになっているため戻す
      const ele = document.querySelector('.find-paragraph-popper') as HTMLElement
      if (ele && this.suggestions.length > 0) {
        ele.style.display = 'block'
      }
    },

    closeDialog() {
      this.paragraphText = ''
      // HACK: ESCで閉じるとサジェストのみが残ってしまうので強制的に消す
      const ele = document.querySelector('.find-paragraph-popper') as HTMLElement
      ele.style.display = 'none'
      this.$store.commit('hideFindParagraphDialog')
    },
  },
})
</script>

<style lang="scss">
.find-paragraph-dialog {
  &.el-dialog {
    background: transparent;
  }

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
  }

  .autocomplete {
    width: 100%;
  }
}

.find-paragraph-popper {
  ul {
    li {
      line-height: normal;
      padding: 7px 14px;

      .item {
        display: flex;

        .heading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 20px;
          min-width: 26px;
          margin-right: 10px;
          background: #ccc;
          color: #fff;
          font-size: 12px;
          line-height: 12px;
          border-radius: 3px;
        }

        .text {
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .heading-2 {
          text-indent: 1em;
        }

        .heading-3 {
          text-indent: 2em;
        }

        .heading-4 {
          text-indent: 3em;
        }

        .heading-5 {
          text-indent: 4em;
        }

        .heading-6 {
          text-indent: 5em;
        }
      }
    }
  }
}
</style>
