<template>
  <div class="main">
    <header>
      <tool-bar />
    </header>
    <main>
      <editor />
      <preview />
    </main>
    <footer>
      <status-bar />
    </footer>
    <div>
      <find-paragraph-dialog />
      <find-title-dialog />
      <find-content-dialog />
      <image-dialog />
      <link-dialog />
      <table-dialog />
      <rename-dialog />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import toolBar from '@/components/tool-bar.vue'
import editor from '@/components/editor.vue'
import preview from '@/components/preview.vue'
import statusBar from '@/components/status-bar.vue'
import findParagraphDialog from '@/components/dialog/find-paragraph-dialog.vue'
import findTitleDialog from '@/components/dialog/find-title-dialog.vue'
import findContentDialog from '@/components/dialog/find-content-dialog.vue'
import imageDialog from '@/components/dialog/image-dialog.vue'
import linkDialog from '@/components/dialog/link-dialog.vue'
import tableDialog from '@/components/dialog/table-dialog.vue'
import renameDialog from '@/components/dialog/rename-dialog.vue'

export default defineComponent({
  components: {
    toolBar,
    editor,
    preview,
    statusBar,
    findParagraphDialog,
    findTitleDialog,
    findContentDialog,
    imageDialog,
    linkDialog,
    tableDialog,
    renameDialog,
  },
})
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;

  header {
    height: 50px;
  }

  main {
    height: calc(100% - 70px);
  }

  footer {
    height: 20px;
  }
}
</style>
