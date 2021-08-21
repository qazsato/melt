<template>
  <section class="tool-bar">
    <h1 class="file-name">
      <template v-if="$store.state.note.filePath">
        <el-popover
          v-model="visiblePopover"
          placement="right"
          trigger="click"
          popper-class="file-name-popper"
          :disabled="!isSaved"
        >
          <el-row>
            <el-link
              type="primary"
              icon="el-icon-edit"
              @click="onClickEdit"
            >
              rename
            </el-link>
          </el-row>
          <el-row>
            <el-link
              type="danger"
              icon="el-icon-delete"
              @click="onClickDelete"
            >
              delete
            </el-link>
          </el-row>
          <div
            slot="reference"
            :class="{ 'editable': isSaved }"
          >
            {{ $store.state.note.title }}
          </div>
        </el-popover>
      </template>
      <template v-else>
        <div>{{ $store.state.note.title }}</div>
      </template>
      <span
        v-if="!isSaved"
        class="unsaved"
      >*</span>
    </h1>

    <el-radio-group
      v-model="viewMode"
      class="checkbox-mode"
      size="mini"
      @change="changeViewMode"
    >
      <el-radio-button label="editor">
        TEXT
      </el-radio-button>
      <el-radio-button label="preview">
        HTML
      </el-radio-button>
    </el-radio-group>
  </section>
</template>

<script>
export default {
  data () {
    return {
      viewMode: this.$store.state.viewMode,
      visiblePopover: false
    }
  },

  computed: {
    isSaved () {
      return this.$store.state.note.isSaved
    }
  },

  mounted () {
    this.$store.watch(
      (state) => state.viewMode,
      (value) => {
        this.viewMode = value
      }
    )
  },

  methods: {
    changeViewMode () {
      this.$store.commit('changeViewMode', this.viewMode)
    },

    onClickEdit () {
      this.visiblePopover = false
      this.$store.commit('showRenameDialog')
    },

    onClickDelete () {
      this.visiblePopover = false
      if (window.confirm(`${this.$store.state.note.title}を削除しますか`)) {
        this.$store.commit('deleteNote')
        this.$store.commit('createNewNote')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tool-bar {
  position: relative;
  background-color: #4a4a4a;

  .file-name {
    display: flex;
    align-items: center;
    margin: 0 15px;
    height: 50px;
    color: #fff;

    .editable {
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }

    div {
      font-size: 18px;
      font-weight: bold;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .unsaved {
    padding-top: 9px;
    padding-left: 5px;
  }

  .checkbox-mode {
    position: absolute;
    top: 12px;
    right: 15px;
  }
}
</style>

<style lang="scss">
#toolbar {
  .checkbox-mode {
    .el-radio-button__inner {
      padding: 6px 10px;
    }
  }
}

.file-name-popper {
  &.el-popover {
    padding: 8px 16px;
    min-width: auto;
  }

  &.el-popper[x-placement^="right"] {
    margin-left: 20px;
  }

  .el-row {
    margin-bottom: 5px;
  }
}
</style>
