<template>
  <el-dialog
    v-model="$store.state.visibleTableDialog"
    title="Table"
    :close-on-click-modal="false"
    width="400px"
    :before-close="closeDialog"
    @open="openDialog"
  >
    <el-form label-width="45px">
      <el-form-item label="Row">
        <el-input-number ref="tableRowInput" v-model="tableRow" :max="20" :min="2" @keyup.enter="insertTable" />
      </el-form-item>
      <el-form-item label="Col">
        <el-input-number v-model="tableColumn" :max="20" :min="2" @keyup.enter="insertTable" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="insertTable">Insert</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface DataType {
  tableRow: number
  tableColumn: number
}

export default defineComponent({
  emits: ['insert'],

  data() {
    const data: DataType = {
      tableRow: 3,
      tableColumn: 3,
    }
    return data
  },

  methods: {
    openDialog() {
      setTimeout(() => {
        // @ts-ignore
        this.$refs.tableRowInput.focus()
      })
    },

    closeDialog() {
      this.tableRow = 3
      this.tableColumn = 3
      this.$store.commit('hideTableDialog')
    },

    insertTable() {
      this.$emit('insert', this.tableRow, this.tableColumn)
      this.closeDialog()
    },
  },
})
</script>
