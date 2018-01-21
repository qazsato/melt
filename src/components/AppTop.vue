<template>
  <div id="screen">
    <aside>
      <filetree></filetree>
    </aside>
    <main>
      <toolbar></toolbar>
      <section>
        <editor @changeText="changeText"></editor>
        <preview :text="text"></preview>
      </section>
    </main>
  </div>
</template>

<script>
import toolbar from './Toolbar.vue';
import filetree from './Filetree.vue';
import editor from './Editor.vue';
import preview from './Preview.vue';

export default {
  components: {
    toolbar,
    filetree,
    editor,
    preview
  },
  data() {
    return {
      text: ''
    };
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

  aside {
    width: 250px;
  }

  main {
    width: calc(100% - 250px);
    height: 100%;
  }

  main > section {
    display: flex;
    height: calc(100% - 50px);
  }
</style>
