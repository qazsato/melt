<template>
  <section class="tool-bar" :class="theme">
    <h1 class="file-name">
      <template v-if="$store.state.note.filePath">
        <el-popover
          v-model="visiblePopover"
          placement="right"
          trigger="click"
          width="70px"
          :offset="20"
          popper-class="file-name-popper"
          :disabled="isChanged"
        >
          <el-row>
            <el-link type="primary" icon="EditPen" :underline="false" @click="onClickEdit">rename</el-link>
          </el-row>
          <el-row>
            <el-link type="danger" icon="Delete" :underline="false" @click="onClickDelete">delete</el-link>
          </el-row>
          <template #reference>
            <div :class="{ editable: !isChanged }">{{ $store.state.note.title }}</div>
          </template>
        </el-popover>
      </template>
      <template v-else>
        <div>{{ $store.state.note.title }}</div>
      </template>
      <span v-if="isChanged" class="changed">*</span>
    </h1>

    <el-radio-group v-model="viewMode" class="checkbox-mode" size="small" @change="changeViewMode">
      <el-radio-button label="editor">TEXT</el-radio-button>
      <el-radio-button label="preview">HTML</el-radio-button>
    </el-radio-group>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { State } from '@/store'

interface DataType {
  viewMode: string
  visiblePopover: boolean
}

export default defineComponent({
  data() {
    const data: DataType = {
      viewMode: this.$store.state.viewMode,
      visiblePopover: false,
    }
    return data
  },

  computed: {
    theme() {
      return this.$store.state.preference.theme
    },

    isChanged() {
      return this.$store.state.note.isChanged
    },
  },

  mounted() {
    this.$store.watch(
      (state: State) => state.viewMode,
      (value: string) => {
        this.viewMode = value
      },
    )
  },

  methods: {
    changeViewMode() {
      this.$store.commit('changeViewMode', this.viewMode)
    },

    onClickEdit() {
      this.visiblePopover = false
      this.$store.commit('showRenameDialog')
    },

    onClickDelete() {
      this.visiblePopover = false
      if (window.confirm(`${this.$store.state.note.title}を削除しますか`)) {
        this.$store.commit('deleteNote')
        this.$store.commit('createNewNote')
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.tool-bar {
  position: relative;

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

  .changed {
    padding-top: 9px;
    padding-left: 5px;
  }

  .checkbox-mode {
    position: absolute;
    top: 12px;
    right: 15px;

    ::v-deep(.el-radio-button__inner) {
      padding: 6px 10px;
    }
  }

  &.melt-light {
    background-color: var.$light-header-bg-color;
  }

  &.melt-dark {
    background-color: var.$dark-header-bg-color;
  }
}
</style>

<style lang="scss">
.file-name-popper {
  &.el-popper {
    &.el-popover {
      padding: 6px 14px 10px;
      min-width: auto;
    }
  }

  .el-link {
    line-height: 26px;
  }

  .el-icon {
    margin-right: 6px;
  }
}
</style>
