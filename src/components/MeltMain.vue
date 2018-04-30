<template>
  <div id="screen" :class="{'visible-aside': visibleAside}">
    <aside>
      <filetree></filetree>
    </aside>
    <main>
      <toolbar></toolbar>
      <tags></tags>
      <section class="note">
        <editor @changeText="changeText"></editor>
        <preview :text="text"></preview>
      </section>
    </main>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron';
import toolbar from './Toolbar.vue';
import filetree from './Filetree.vue';
import editor from './Editor.vue';
import preview from './Preview.vue';
import tags from './Tags.vue';
import Note from '../assets/scripts/note.js';

export default {
  components: {
    toolbar,
    filetree,
    editor,
    preview,
    tags
  },
  data() {
    return {
      text: '',
      visibleAside: true
    };
  },
  methods: {
    changeText(text) {
      this.text = text;
    }
  },
  mounted() {
    ipcRenderer.on('new-post', () => {
      const note = new Note();
      this.$store.commit('changeCurrentFile', note.readPath());
      this.$store.commit('updateTreeDatas');
    });
    ipcRenderer.on('toggle-aside', () => this.visibleAside = !this.visibleAside);
    ipcRenderer.on('focus-search', () => this.visibleAside = true);
  }
}
</script>

<style scoped>
  #screen {
    display: flex;
    height: 100%;
  }

  #screen aside {
    display: none;
    width: 250px;
  }

  #screen main {
    width: 100%;
    height: 100%;
  }

  #screen.visible-aside aside {
    display: block;
  }

  #screen.visible-aside main {
    width: calc(100% - 250px);
  }

  .note {
    display: flex;
    height: calc(100% - 90px);
  }
</style>
