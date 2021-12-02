<template>
  <div class="setting">
    <el-page-header @back="goBack" content="Setting"></el-page-header>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  methods: {
    goBack() {
      this.$router.push({ path: '/' })
    },
  },
})
</script>

<style lang="scss" scoped>
.setting {
  width: 100%;
  height: 100%;
}
</style>
