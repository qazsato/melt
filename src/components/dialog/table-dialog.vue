<template>
  <el-dialog
    title="Table"
    :visible.sync="$store.state.visibleTableDialog"
    :close-on-click-modal="false"
    width="400px"
    :before-close="closeDialog"
    @open="openDialog"
  >
    <el-form label-width="45px">
      <el-form-item label="Row">
        <el-input-number
          ref="tableRowInput"
          v-model="tableRow"
          :max="10"
          :min="1"
          @keyup.enter.native="insertTable"
        />
      </el-form-item>
      <el-form-item label="Col">
        <el-input-number
          v-model="tableColumn"
          :max="10"
          :min="1"
          @keyup.enter.native="insertTable"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="insertTable"> Insert </el-button>
      <el-button @click="closeDialog"> Cancel </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      tableRow: 3,
      tableColumn: 3,
    }
  },

  methods: {
    openDialog() {
      this.$nextTick().then(() => this.$refs.tableRowInput.$refs.input.focus())
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
}
</script>
