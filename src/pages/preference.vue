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
          <el-radio v-model="theme" :label="light">light</el-radio>
          <el-radio v-model="theme" :label="dark">dark</el-radio>
        </div>
        <h3>Initial note on startup</h3>
        <div>
          <el-radio v-model="initialNote" :label="blank">blank</el-radio>
          <el-radio v-model="initialNote" :label="recentlyOpened">recently opened</el-radio>
        </div>
      </section>
      <!-- <section>
        <h2>Editor</h2>
        <h3>font-family</h3>
        <el-input placeholder="Please input" v-model="input"></el-input>
        <h3>font-size</h3>
        <el-slider v-model="value1"></el-slider>
      </section> -->
      <el-row type="flex" justify="end">
        <el-button type="primary" @click="onSave">Save</el-button>
      </el-row>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { THEME, INITIAL_NOTE, PAGE } from '@/constants'
import { Preference } from '@/config/setting'
import { getPreference } from '@/utils/local-storage'

export default Vue.extend({
  data() {
    const preference: Preference = getPreference()
    return {
      directory: preference.directory,
      theme: preference.theme,
      initialNote: preference.initialNote,
    }
  },

  computed: {
    light() {
      return THEME.LIGHT
    },

    dark() {
      return THEME.DARK
    },

    blank() {
      return INITIAL_NOTE.BLANK
    },

    recentlyOpened() {
      return INITIAL_NOTE.RECENTRY_OPENED
    },
  },

  methods: {
    goBack() {
      this.$router.push({ name: PAGE.MAIN })
    },

    onSave() {
      const preference: Preference = {
        directory: this.directory,
        theme: this.theme,
        initialNote: this.initialNote,
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
    background: $light-color;
    color: $light-bg-color;
  }

  &.melt-dark {
    color: $dark-color;
    background: $dark-bg-color;
  }
}
</style>
