<template>
  <modal
    name="edit-modal"
    width="100%"
    class="editor-modal"
    height="100%"
    :adaptive="true"
    @closed="close"
    @before-open="beforeOpen"
    @before-close="beforeClose"
  >
    <div class="flex flex-col mx-1 sm:mx-0 h-full p-2">
      <div class="flex-auto flex flex-col">
        <!-- <textarea class="mousetrap" ref="noteinput" id="note" :model="content"></textarea> -->
        <label
          ref="edittoplabel"
          class="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="note"
        >content (markdown)</label>
        <editor
          ref="tuiEditor"
          class="editor-main"
          v-model="content"
          height="100%"
          :options="editorOptions"
        />
      </div>
      <div class="flex flex-wrap items-center border-b border-b-2 border-gray-500 mb-2">
        <label
          class="flex-auto uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="note"
        >tags</label>
        <input
          ref="tags"
          v-model="tags"
          class="mousetrap flex-auto appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="work, play, joke"
          aria-label="tags"
        >
      </div>
      <div class="flex">
        <button
          @click="save"
          class="save-button flex-auto py-2 px-6 button primary rounded text-white font-bold mr-2"
        >
          save
          <span class="hidden sm:inline-block">( alt + enter )</span>
        </button>
        <button
          @click="cancel"
          class="py-2 px-4 border border-gray-500 hover:border-gray-600 rounded font-bold text-gray-700"
        >
          cancel
          <span class="hidden sm:inline-block">( esc )</span>
        </button>
      </div>
    </div>
  </modal>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import marked from "marked";
import Mousetrap from "mousetrap";
import scrollLock from "scroll-lock";

import { Editor } from "@toast-ui/vue-editor";

import TagInput from "./TagInput";
import notesApi from "../api/notes";

import addEventListener from "add-dom-event-listener";

export default {
  name: "note-edit",
  components: { TagInput, Editor },

  data() {
    return {
      shortcuts: false,
      editorOptions: {
        minHeight: "100px",
        initialEditType: "markdown",
        hideModeSwitch: true,
        usageStatistics: false,
        toolbarItems: [
          "heading",
          "bold",
          "italic",
          "strike",
          "divider",
          "hr",
          "quote",
          "divider",
          "ul",
          "ol",
          "indent",
          "outdent",
          "divider",
          "link",
          "code",
          "codeblock"
        ]
      }
    };
  },

  mounted() {
    this.shortcuts = addEventListener(window, "keydown", event => {
      if (event.altKey && event.key === "Enter") {
        event.preventDefault();
        if (event.target == this.$refs.tags) {
          this.save();
        } else if (this.$refs.tuiEditor.editor.getCodeMirror().hasFocus()) {
          this.$refs.tags.focus();
        }
      }
    });
  },

  beforeDestroy() {
    this.shortcuts.remove();
  },

  methods: {
    close() {
      this.cancel();
    },

    beforeOpen() {
      scrollLock.disablePageScroll(document.documentElement);
    },

    beforeClose() {
      scrollLock.enablePageScroll(document.documentElement);
    },

    save() {
      if (this.editedNote) {
        this.changeNote();
      } else {
        this.addNewNote();
      }
    },

    cancel() {
      this.editorActive = false;
      this.clearEditorState();
    },

    focusEditor() {
      this.easyMDE.codemirror.focus();
    },

    addOrUpdate() {
      if (this.editedNote) {
        this.changeNote();
      } else {
        this.addNewNote();
      }
    },

    addNewNote() {
      const body = this.content.trim();
      const tags = this.tags.trim();
      if (body) {
        notesApi.create(body, tags).then(doc => {
          this.addNote(doc);
          this.editorActive = false;
        });
      }
    },

    changeNote() {
      const body = this.content.trim();
      const tags = this.tags.trim();
      if (body) {
        notesApi.update(this.editedNote._id, body, tags).then(doc => {
          this.updateNote(doc);
          this.editorActive = false;
        });
      }
    },

    ...mapActions([
      "addNote",
      "updateNote",
      "removeNote",
      "setEditorStateActive",
      "setEditorState",
      "clearEditorState"
    ])
  },

  computed: {
    editor() {
      return this.$store.state.editor;
    },

    editorActive: {
      get() {
        return this.$store.state.editor.active;
      },

      set(v) {
        return this.setEditorStateActive(v);
      }
    },

    content: {
      get() {
        return this.$store.state.editor.content;
      },

      set(value) {
        return this.setEditorState({ key: "content", value });
      }
    },

    tags: {
      get() {
        return this.$store.state.editor.tags;
      },

      set(value) {
        return this.setEditorState({ key: "tags", value });
      }
    },

    editedNote() {
      return this.$store.state.editor.note;
    }
  },

  watch: {
    editorActive: function(n, o) {
      if (n) {
        this.$modal.show("edit-modal");
        this.$nextTick(() => {
          // this.$refs.tuiEditor.invoke("focus");
        });
      } else {
        this.$modal.hide("edit-modal");
      }
    }
  }
};
</script>

<style lang="scss">
.save-button {
  bottom: 10px;
  right: 10px;
}

.editor-modal {
  .v--modal-box.v--modal {
    border-radius: 0;

    .editor-main {
      .tui-editor-defaultUI {
        border: none;
      }

      .te-tab {
        margin: 0;
        height: 100%;
        button {
          border: none;
          height: 31px;
        }
      }

      .tui-editor-defaultUI-toolbar {
        margin: 0;
        padding: 0;
      }
    }

    .cm-s-default .cm-header {
      @apply text-black;
    }
  }

  @screen sm {
    .v--modal-box.v--modal {
      width: 80% !important;
      margin: 0 auto;
    }
  }
}
</style>
