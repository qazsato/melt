<template>
  <div id="screen">
    <toolbar :editor="editor" @visiblePreview="visiblePreview"></toolbar>
    <main>
      <editor @mountEditor="mountEditor" @changeText="changeText"></editor>
      <preview :text="text" :visible="visible"></preview>
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
      visible: true
    };
  },
  methods: {
    mountEditor(editor) {
      this.editor = editor;
    },
    changeText(text) {
      this.text = text;
    },
    visiblePreview(visible) {
      this.visible = visible;
      // NOTE エディタの表示領域を補正するためリサイズイベントを発火させる
      setTimeout(() => window.dispatchEvent(new Event('resize')));
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
