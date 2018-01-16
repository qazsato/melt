<template>
  <div id="screen">
    <toolbar></toolbar>
    <main>
      <editor @changeText="changeText"></editor>
      <preview :text="text"></preview>
    </main>
  </div>
</template>

<script>
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

  main {
    display: flex;
    height: calc(100% - 50px);
  }
</style>
