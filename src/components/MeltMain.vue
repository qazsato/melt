<template>
  <main>
    <toolbar />
    <section class="note">
      <editor @changeText="changeText" />
      <preview :text="text" />
    </section>
  </main>
</template>

<script>
import {ipcRenderer} from 'electron';
import toolbar from './Toolbar.vue';
import editor from './Editor.vue';
import preview from './Preview.vue';

export default {
  components: {
    toolbar,
    editor,
    preview
  },
  data() {
    return {
      text: '',
      visibleAside: true
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
    }
  }
}
</script>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.note {
  flex: 1;
  background-color: #fff;
}
</style>
