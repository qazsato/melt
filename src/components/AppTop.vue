<template>
  <div id="screen">
    <toolbar :editor="editor" @changeViewMode="changeViewMode"></toolbar>
    <main>
      <editor :mode="mode" @mountEditor="mountEditor" @changeText="changeText"></editor>
      <preview :mode="mode" :text="text"></preview>
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
      editor: null,
      text: '',
      mode: 'multi'
    };
  },
  methods: {
    mountEditor(editor) {
      this.editor = editor;
    },
    changeText(text) {
      this.text = text;
    },
    changeViewMode(mode) {
      this.mode = mode;
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
