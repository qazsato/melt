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
      <section>
        <h2>Editor</h2>
        <h3>Font Family</h3>
        <el-input v-model="fontFamily"></el-input>
        <h3>Font Size</h3>
        <el-slider v-model="fontSize" :min="10" :max="30" show-input></el-slider>
      </section>
      <el-row type="flex" justify="end">
        <el-button type="primary" @click="onSave" class="save-button">Save</el-button>
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
      fontFamily: preference.fontFamily,
      fontSize: preference.fontSize,
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
        fontFamily: this.fontFamily,
        fontSize: this.fontSize,
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
    color: $light-color;
    background-color: $light-bg-color;

    .el-page-header {
      background-color: $light-header-bg-color;
    }

    .el-radio {
      color: $light-color;
    }

    /deep/ .el-input__inner {
      color: $light-color;
      background-color: $light-input-bg-color;
      border-color: $light-input-border-color;
    }
  }

  &.melt-dark {
    color: $dark-color;
    background-color: $dark-bg-color;

    .el-page-header {
      background-color: $dark-header-bg-color;
    }

    .el-radio {
      color: $dark-color;
    }

    /deep/ .el-input__inner {
      color: $dark-color;
      background-color: $dark-input-bg-color;
      border-color: $dark-input-border-color;
    }
  }

  .save-button {
    margin-top: 20px;
  }
}
</style>
