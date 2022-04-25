<template>
  <el-dialog
    :visible.sync="$store.state.visibleFindTextDialog"
    :show-close="false"
    :lock-scroll="false"
    custom-class="find-text-dialog"
    width="400px"
    :before-close="closeDialog"
    @open="openDialog"
  >
    <el-autocomplete
      ref="input"
      v-model="query"
      class="autocomplete"
      popper-class="find-text-popper"
      :fetch-suggestions="queryFindText"
      placeholder="Find text in note"
      :highlight-first-item="true"
      :popper-append-to-body="false"
      @keyup.native="onKeyup"
      @select="onSelect"
    >
      <template slot-scope="{ item }">
        <div class="label">
          {{ item.text }}
        </div>
      </template>
    </el-autocomplete>
  </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

interface Suggestion {
  text: string
}

interface DataType {
  query: string
  suggestions: Suggestion[]
  isComposing: boolean
}

export default Vue.extend({
  data() {
    const data: DataType = {
      query: '',
      suggestions: [],
      isComposing: false, // 日本語入力(IME)が未確定か否か
    }
    return data
  },

  computed: {
    visibleFindTextDialog() {
      return this.$store.state.visibleFindTextDialog
    },
  },

  watch: {
    visibleFindTextDialog(value) {
      if (value) {
        this.$nextTick().then(() => {
          // @ts-ignore
          this.$refs.input.$refs.input.focus()
        })
      }
    },
  },

  methods: {
    queryFindText(query: string, callback: (suggestion: Suggestion[]) => void) {
      const note = this.$store.state.note
      this.suggestions = []
      if (query) {
        this.suggestions = note.find(query).map((word: string) => {
          return {
            text: word,
          }
        })
      }
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
        if (this.$store.state.note.isChanged) {
          if (!window.confirm('変更が保存されていません。変更を破棄してよいですか。')) {
            // @ts-ignore
            this.$refs.input.$refs.input.blur()
            return
          }
        }
        this.$store.commit('hideFindTextDialog')
      })
    },

    openDialog() {
      // HACK: closeDialogで消えたままになっているため戻す
      const ele = document.querySelector('.find-text-popper') as HTMLElement
      if (ele && this.suggestions.length > 0) {
        ele.style.display = 'block'
      }
    },

    closeDialog() {
      this.query = ''
      // HACK: ESCで閉じるとサジェストのみが残ってしまうので強制的に消す
      const ele = document.querySelector('.find-text-popper') as HTMLElement
      ele.style.display = 'none'
      this.$store.commit('hideFindTextDialog')
    },
  },
})
</script>

<style lang="scss">
.find-text-dialog {
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

.find-text-popper {
  .el-autocomplete-suggestion__list {
    > li {
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
