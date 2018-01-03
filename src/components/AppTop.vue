<template>
  <div id="screen">
    <toolbar :editor="editor"></toolbar>
    <main>
      <editor @mountEditor="mountEditor" @changeText="changeText"></editor>
      <preview :text="text"></preview>
    </main>
    <publish-button></publish-button>
  </div>
</template>

<script>
import toolbar from './Toolbar.vue';
import editor from './Editor.vue';
import preview from './Preview.vue';
import publishButton from './PublishButton.vue';

export default {
  components: {
    toolbar,
    editor,
    preview,
    publishButton
  },
  data() {
    return {
      editor: null,
      text: ''
    };
  },
  methods: {
    mountEditor(editor) {
      this.editor = editor;
    },
    changeText(text) {
      this.text = text;
    }
  }
}
</script>

<style>
  html {
    height: 100%;
  }

  body {
    height: 100%;
    margin: 0;
  }

  #app {
    height: 100%;
  }
</style>

<style scoped>
  #screen {
    height: 100%;
  }

  main {
    display: flex;
    height: calc(100% - 50px);
  }
</style>
