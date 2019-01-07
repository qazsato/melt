<template>
  <div>
    <el-button
      class="upload-btn"
      type="primary"
      @click="uploadText"
    >
      <i class="icon-upload" />
    </el-button>
    <el-dialog
      title="Note"
      :visible.sync="uploadDialogVisible"
      width="400px"
    >
      <el-input
        id="url-input"
        v-model="noteUrl"
      >
        <el-button
          slot="append"
          icon="el-icon-document"
          class="copy-btn"
          data-clipboard-target="#url-input"
        />
      </el-input>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="openBrowser"
        >
          Open
        </el-button>
        <el-button @click="uploadDialogVisible = false">
          Cancel
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import settings from '../../config/settings.json';
import Clipboard from 'clipboard';

export default {
  data() {
    return {
      uploadDialogVisible: false,
      noteUrl: ''
    };
  },
  mounted() {
    new Clipboard('.copy-btn');
  },
  methods: {
    uploadText() {
      const path = this.$store.state.note.readPath();
      const content = this.$store.state.note.readContent();
      const url = `${settings.api}/note`;
      axios.post(url, {path, content})
        .then((res) => {
          this.uploadDialogVisible = true;
          this.noteUrl = res.data.url;
        })
        .catch((e) => {});
    },
    openBrowser() {
      window.open(this.noteUrl);
    }
  }
}
</script>

<style scoped>
  .upload-btn {
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
