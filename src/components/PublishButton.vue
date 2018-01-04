<template>
  <button @click="uploadText">
    <i class="icon-upload"></i>
  </button>
</template>

<script>
export default {
  methods: {
    uploadText() {
      console.log('upload');
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
    border: none;
    border-radius: 50%;
    color: #fff;
    background-color: #00b1b3;
    box-shadow: 0px 0px 26px -8px rgba(0, 0, 0, 0.7);
    cursor: pointer;
  }

  .icon-upload {
    display: inline-block;
    font-size: 32px;
  }
</style>
