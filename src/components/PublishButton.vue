<template>
  <button @click="uploadText">
    <i class="material-icons">cloud_upload</i>
    <div class="text">共有する</div>
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
    bottom: 8px;
    right: 8px;
    height: 80px;
    width: 80px;
    padding: 0;
    border: none;
    border-radius: 50%;
    color: #fff;
    background-color: #ff5555;
    box-shadow: 0px 0px 26px -8px rgba(0, 0, 0, 0.7);
    cursor: pointer;
  }

  button:hover {
    background-color: #ff2222;
  }

  .text {
    font-size: 13px;
  }

  .material-icons {
    font-size: 32px;
  }
</style>
