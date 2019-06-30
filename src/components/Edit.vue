<template>
  <modal
    name="edit-modal"
    width="100%"
    class="editor-modal"
    height="100%"
    :adaptive="true"
    @opened="opened"
    @closed="close"
    @before-open="beforeOpen"
    @before-close="beforeClose"
  >
    <div
      class="editor-wrapper flex flex-col mx-1 sm:mx-0 h-full p-2"
      :class="{'tags-focused': tagsFocused}"
    >
      <div class="flex-auto flex flex-col">
        <label
          ref="edittoplabel"
          class="content-label uppercase tracking-wide \ text-xs font-bold mb-2"
          for="note"
        >content (markdown)</label>
        <editor
          @load="load"
          @focus="unfocusTags"
          ref="tuiEditor"
          height="100%"
          v-model="content"
          :options="editorOptions"
          :key="editedNote._id"
        />
      </div>
      <div class="editor-footer">
        <div
          class="tags-input-group flex flex-wrap items-center border-b border-b-2 border-gray-500 mb-2 pt-2 z-10"
        >
          <label class="flex-auto uppercase tracking-wide text-xs font-bold" for="note">tags</label>
          <input
            ref="tags"
            v-model="tags"
            class="mousetrap flex-auto appearance-none bg-transparent border-none w-full mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="work, play, joke"
            aria-label="tags"
          />
        </div>
        <div class="flex edit-actions z-10">
          <button
            @click="save"
            class="save-button flex-auto py-2 px-6 button primary font-bold mr-2"
          >
            save
            <span class="hidden sm:inline-block">( alt + enter )</span>
          </button>
          <button @click="cancel" class="cancel-button py-2 px-4 border-2 font-bold">
            cancel
            <span class="hidden sm:inline-block">( esc )</span>
          </button>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import marked from "marked";
import Mousetrap from "mousetrap";
import scrollLock from "scroll-lock";

import TagInput from "./TagInput";
import notesApi from "../api/notes";

import addEventListener from "add-dom-event-listener";

import "codemirror/addon/display/panel";
import "../plugins/codemirror/buttons";
import "codemirror/mode/gfm/gfm";

import { Editor } from "@toast-ui/vue-editor";

import {
  editorButtons,
  createTuiButtonEvent,
  afterLoad
} from "../helper/editor";

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
        toolbarItems: editorButtons()
      },
      windowResizeEvent: false,
      tagsFocus: false,
      tagsBlurEvent: false,
      tagsFocusEvent: false
    };
  },

  mounted() {
    this.shortcuts = addEventListener(window, "keydown", event => {
      if (event.altKey && event.key === "Enter") {
        event.preventDefault();
        if (event.target == this.$refs.tags) {
          this.save();
        } else if (this.$refs.tuiEditor.invoke("getCodeMirror").hasFocus()) {
          this.focusTags();
        } else {
          this.save();
        }
      }
    });

    this.windowResizeEvent = addEventListener(window, "resize", event => {
      this.resizeEditor();
    });
  },

  beforeDestroy() {
    this.shortcuts.remove();
    this.windowResizeEvent.remove();
  },

  methods: {
    resizeEditor() {
      return new Promise((resolve, reject) => {
        if (typeof this.$refs.tuiEditor !== "undefined") {
          const cm = this.$refs.tuiEditor.invoke("getCodeMirror");
          cm.setSize(
            "100%",
            this.$refs.tuiEditor.editor.layout.$containerEl.height()
          );
          return resolve();
        }
        return resolve();
      });
    },

    load(editor) {
      afterLoad(editor);

      createTuiButtonEvent(
        editor,
        "focuTags",
        this.focusTags,
        "Focus Tags",
        "focus-tags",
        "Focus Tags",
        "<svg class='icon'><use xlink:href='#icon-price-tags'></use></svg>",
        21
      );

      editor
        .getCodeMirror()
        .setOption("theme", this.darkMode ? "nord" : "default");

      this.$nextTick(() => {
        this.resizeEditor();
        editor.focus();
      });
    },

    focusTags() {
      this.tagsFocus = true;
      this.$refs.tags.focus();
    },

    unfocusTags() {
      this.tagsFocus = false;
    },

    opened() {
      this.tagsBlurEvent = addEventListener(this.$refs.tags, "blur", event => {
        this.unfocusTags();
      });
      this.tagsFocusEvent = addEventListener(
        this.$refs.tags,
        "focus",
        event => {
          this.tagsFocus = true;
        }
      );
    },

    close() {
      this.tagsBlurEvent.remove();
      this.tagsFocusEvent.remove();

      this.cancel();
    },

    beforeOpen() {
      scrollLock.addScrollableSelector(".CodeMirror-scroll");
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
    },

    tagsFocused() {
      return this.tagsFocus || document.activeElement == this.$refs.tags;
    },

    darkMode() {
      return this.$store.state.settings.theme.value == 2;
    }
  },

  watch: {
    editorActive: function(n, o) {
      if (n) {
        this.$modal.show("edit-modal");
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

    .te-markdown-tab-section {
      display: none !important;
    }

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
      display: flex;
      flex-wrap: wrap;

      button.tui-toolbar-custom {
        padding: 0;
        margin: 0;
        width: auto;
        height: auto;

        .icon {
          margin: 0.5rem;
        }
      }
    }
    .tui-editor-defaultUI .CodeMirror-line {
      @apply px-2;
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

  .CodeMirror {
    @apply h-full;

    .CodeMirror-gutters {
      background: transparent;
    }
  }

  @media screen and (max-height: 400px) {
    .content-label,
    .editor-footer {
      display: none;
    }

    .tags-focused {
      .content-label {
        display: block;
      }

      .editor-footer {
        box-sizing: border-box;
        width: 100%;
        display: block;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 1000;
        @apply p-2;
      }
    }
  }
}
</style>
