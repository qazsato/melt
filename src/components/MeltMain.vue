<template>
  <main>
    <toolbar />
    <section class="note">
      <editor @changeText="changeText" />
      <preview :text="text" />
    </section>
    <file-dialog />
  </main>
</template>

<script>
import {ipcRenderer} from 'electron';
import toolbar from './Toolbar.vue';
import editor from './Editor.vue';
import preview from './Preview.vue';
import fileDialog from './FileDialog.vue';

export default {
  components: {
    toolbar,
    editor,
    preview,
    fileDialog,
  },
  data() {
    return {
      text: ''
    };
  },
  mounted() {
    ipcRenderer.on('new-post', () => {
      this.$store.commit('createNewPost');
    });

    ipcRenderer.on('open-file', () => {
      this.$store.commit('visualizeFileSearchBox', true)
    });

    ipcRenderer.on('toggle-view-mode', () => {
      this.$store.commit('toggleViewMode');
    });
  },
  methods: {
    changeText(text) {
      this.text = text;
      this.$store.commit('updateIsUnsaved');
    }
  }
}
</script>

<style lang="scss" scoped>
main {
  width: 100%;
  height: 100%;
}

.note {
  height: calc(100% - 50px);
  background-color: #fff;
}
</style>
