<template>
  <div id="screen">
    <toolbar></toolbar>
    <section>
      <aside>
        <filetree></filetree>
      </aside>
      <main>
        <editor @changeText="changeText"></editor>
        <preview :text="text"></preview>
      </main>
    </section>
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
    height: 100%;
  }

  section {
    display: flex;
    height: 100%;
  }

  aside {
    width: 250px;
  }

  main {
    display: flex;
    flex: 1;
    height: calc(100% - 50px);
  }
</style>
