<template>
  <el-button type="primary" @click="uploadText">
     <i class="icon-upload"></i>
  </el-button>
</template>

<script>
import axios from 'axios';
import settings from '../../config/settings.json';

export default {
  methods: {
    uploadText() {
      const content = this.$store.state.note.readContent();
      const url = `${settings.api}/note`;
      axios.post(url, {content})
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
      console.log(content);
    }
  }
}
</script>

<style scoped>
  button {
    position: fixed;
    bottom: 15px;
    right: 15px;
    height: 60px;
    width: 60px;
    padding: 0;
    border-radius: 50%;
    box-shadow: 0px 0px 26px -8px rgba(0, 0, 0, 0.7);
    cursor: pointer;
  }

  .icon-upload {
    display: inline-block;
    font-size: 32px;
  }
</style>
