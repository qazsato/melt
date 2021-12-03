<template>
  <div class="preference" :class="theme">
    <header>
      <el-page-header @back="goBack" content="Preference"></el-page-header>
    </header>
    <main>
      <section>
        <h2>General</h2>
        <h3>Directory</h3>
        <el-input v-model="directory"></el-input>
        <h3>Theme</h3>
        <div>
          <el-radio v-model="theme" label="melt-light">light</el-radio>
          <el-radio v-model="theme" label="melt-dark">dark</el-radio>
        </div>
      </section>
      <el-row type="flex" justify="end">
        <el-button type="primary" @click="onSave">Save</el-button>
      </el-row>
      <!-- <h2>Font</h2>
      <h3>font-family</h3>
      <el-input placeholder="Please input" v-model="input"></el-input>
      <h3>font-size</h3>
      <el-slider v-model="value1"></el-slider> -->
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { PAGE } from '@/constants'
import { Preference } from '@/config/setting'
import { getPreference } from '@/utils/local-storage'

export default Vue.extend({
  data() {
    const preference = getPreference()
    return {
      directory: preference.directory,
      theme: preference.theme,
    }
  },

  methods: {
    goBack() {
      this.$router.push({ name: PAGE.MAIN })
    },

    onSave() {
      const preference: Preference = {
        directory: this.directory,
        theme: this.theme,
      }
      this.$store.commit('updatePreference', preference)
      this.$message({ type: 'success', message: 'Preference saved', showClose: true })
    },
  },
})
</script>

<style lang="scss" scoped>
.preference {
  width: 100%;
  height: 100%;

  header {
    height: 50px;

    .el-page-header {
      padding: 0 15px;
      line-height: 50px;
      color: #fff;
      background-color: #4a4a4a;

      /deep/ .el-page-header__content {
        color: #fff;
      }
    }
  }

  main {
    height: calc(100% - 50px);
    padding: 0 20px;
  }

  &.melt-light {
    color: #24292f;
  }

  &.melt-dark {
    color: #adbac7;
  }
}
</style>
