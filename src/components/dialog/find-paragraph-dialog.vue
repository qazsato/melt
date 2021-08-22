<template>
  <el-dialog
    :visible.sync="$store.state.visibleFindParagraphDialog"
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
      @keydown.native="onKeydown"
      @select="onSelect"
    >
      <template slot-scope="{ item }">
        <div class="item">
          <div class="heading">
            H{{ item.heading }}
          </div>
          <div class="text">
            {{ item.text }}
          </div>
        </div>
      </template>
    </el-autocomplete>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      paragraphText: '',
      tableOfContents: [],
      suggestions: [],
      isComposing: false // 日本語入力(IME)が未確定か否か
    }
  },

  computed: {
    visibleFindParagraphDialog () {
      return this.$store.state.visibleFindParagraphDialog
    }
  },

  watch: {
    visibleFindParagraphDialog (value) {
      if (value) {
        this.$nextTick().then(() => this.$refs.paragraphInput.$refs.input.focus())
      }
    }
  },

  methods: {
    queryFindParagraph (query, callback) {
      const filteredParagraphs = query ? this.tableOfContents.filter((t) => t.text.toLowerCase().includes(query.toLowerCase())) : this.tableOfContents
      this.suggestions = filteredParagraphs.map((t, i) => {
        return {
          text: t.text,
          heading: t.heading,
          index: i
        }
      })
      callback(this.suggestions)
    },

    onKeydown (e) {
      this.isComposing = e.isComposing
    },

    onSelect (item) {
      // HACK: イベント処理順を keydown => select としたいためタイミングをずらしている
      setTimeout(() => {
        if (this.isComposing) {
          return
        }
        // TODO TEXTの場合は、行数にジャンプするようにする
        let i = 0
        const tocs = this.tableOfContents.slice(0, item.index)
        tocs.forEach((t) => {
          if (t.heading === item.heading) i++
        })
        document.getElementsByTagName(`h${item.heading}`)[i].scrollIntoView()
        this.$store.commit('hideFindParagraphDialog')
      })
    },

    openDialog () {
      this.tableOfContents = this.$store.state.note.tableOfContents
      // HACK: closeDialogで消えたままになっているため戻す
      const element = document.querySelector('.find-paragraph-popper')
      if (element && this.suggestions.length > 0) {
        element.style.display = 'block'
      }
    },

    closeDialog () {
      this.paragraphText = ''
      // HACK: ESCで閉じるとサジェストのみが残ってしまうので強制的に消す
      document.querySelector('.find-paragraph-popper').style.display = 'none'
      this.$store.commit('hideFindParagraphDialog')
    }
  }
}
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
      }
    }
  }
}
</style>
