<template>
  <el-dialog
    v-model:visible="$store.state.visibleTableDialog"
    title="Table"
    :close-on-click-modal="false"
    width="400px"
    :before-close="closeDialog"
    @open="openDialog"
  >
    <el-form label-width="45px">
      <el-form-item label="Row">
        <el-input-number ref="tableRowInput" v-model="tableRow" :max="20" :min="2" @keyup.enter.native="insertTable" />
      </el-form-item>
      <el-form-item label="Col">
        <el-input-number v-model="tableColumn" :max="20" :min="2" @keyup.enter.native="insertTable" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">Cancel</el-button>
      <el-button type="primary" @click="insertTable">Insert</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface DataType {
  tableRow: number
  tableColumn: number
}

export default defineComponent({
  data() {
    const data: DataType = {
      tableRow: 3,
      tableColumn: 3,
    }
    return data
  },

  methods: {
    openDialog() {
      this.$nextTick().then(() => {
        // @ts-ignore
        this.$refs.tableRowInput.$refs.input.focus()
      })
    },

    closeDialog() {
      this.tableRow = 3
      this.tableColumn = 3
      this.$store.state.editor.focus()
      this.$store.commit('hideTableDialog')
    },

    insertTable() {
      this.$store.state.editor.insertTable(this.tableRow, this.tableColumn)
      this.closeDialog()
    },
  },
})
</script>
