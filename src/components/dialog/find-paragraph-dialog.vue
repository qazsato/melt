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
      @select="handleParagraphSelect"
    >
      <template slot-scope="{ item }">
        <div class="label">
          {{ item.label }}
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
      tableOfContents: []
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
      const results = filteredParagraphs.map((t, i) => {
        return {
          label: `H${t.heading} ${t.text}`,
          heading: t.heading,
          index: i
        }
      })
      callback(results)
    },

    handleParagraphSelect (item, event) {
      console.log('item', item)
      console.log('event', event)
      // TODO TEXTの場合は、行数にジャンプするようにする
      let i = 0
      const tocs = this.tableOfContents.slice(0, item.index)
      tocs.forEach((t) => {
        if (t.heading === item.heading) i++
      })
      document.getElementsByTagName(`h${item.heading}`)[i].scrollIntoView()
      this.$store.commit('hideFindParagraphDialog')
    },

    openDialog () {
      this.tableOfContents = this.$store.state.note.tableOfContents
      // HACK: closeDialogで消えたままになっていることがあるため戻す
      const element = document.querySelector('.find-paragraph-popper')
      if (element) {
        element.style.display = 'block'
      }
    },

    closeDialog () {
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

      .label {
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
</style>
