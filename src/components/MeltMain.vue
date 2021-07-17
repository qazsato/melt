<template>
  <div id="screen">
    <main>
      <toolbar />
      <section class="note">
        <editor @changeText="changeText" />
        <preview :text="text" />
      </section>
    </main>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron';
import toolbar from './Toolbar.vue';
import editor from './Editor.vue';
import preview from './Preview.vue';
import Note from '@scripts/note/note.js';

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
      const note = new Note();
      this.$store.commit('changeCurrentFile', note.readPath());
      this.$store.commit('updateTreeDatas');
    });
  },
  methods: {
    changeText(text) {
      this.text = text;
    }
  }
}
</script>

<style scoped>
  #screen {
    display: flex;
    height: 100%;
  }

  #screen main {
    width: 100%;
    height: 100%;
  }

  .note {
    display: flex;
    height: calc(100% - 90px);
  }
</style>
