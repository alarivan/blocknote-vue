<template>
  <div class :class="layout">
    <div
      :id="note._id"
      :class="[{ active: active }]"
      class="w-full h-full flex flex-col note p-2 shadow-md relative"
    >
      <div v-if="note.tags.length" class="flex flex-wrap tags m-1">
        <template v-for="(tag, index) in note.tags">
          <button
            @click="addSelectedTag(tag)"
            :key="index"
            :style="tagBg(tag)"
            class="tag"
            :title="tag.name"
          >{{tag.name}}</button>
        </template>
      </div>
      <div class="markdown-body p-3 flex-auto overflow-hidden" v-html="body()"></div>
      <div class="flex flex-row-reverse m-2 note-actions z-10">
        <button
          :class="buttonClasses"
          class="bg-red-800 hover:bg-red-900 text-white"
          @click="deleteNote()"
          title="delete"
        >
          <svg class="icon mx-auto">
            <use xlink:href="#icon-bin2"></use>
          </svg>
        </button>
        <button
          :class="buttonClasses"
          class="bg-blue-800 hover:bg-blue-900 text-white mr-2"
          @click="copyNote()"
          title="copy"
        >
          <svg class="icon mx-auto">
            <use xlink:href="#icon-copy"></use>
          </svg>
        </button>
        <button
          :class="buttonClasses"
          class="bg-orange-500 hover:bg-orange-600 text-white mr-2"
          @click="editNote()"
          title="edit"
        >
          <svg class="icon">
            <use xlink:href="#icon-pencil"></use>
          </svg>
        </button>
        <button
          title="Close"
          v-if="isNoteView"
          class="view-action w-full mr-2 hover:bg-gray-100"
          @click="setNoteView(false)"
        >
          <svg class="icon mx-auto">
            <use xlink:href="#icon-cross"></use>
          </svg>
        </button>
        <button v-else class="view-action w-full mr-2 hover:bg-gray-100" @click="setNoteView(note)">
          <svg class="icon mx-auto">
            <use xlink:href="#icon-enlarge"></use>
          </svg>
        </button>
      </div>

      <transition name="copiedt">
        <div
          v-if="copied"
          class="copied text-gray-800 flex-auto font-bold px-2 absolute w-full h-full top-0 left-0"
        >
          <div class="relative w-full h-full">
            <div class="copied-text absolute absolute-center">copied!</div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import marked from "marked";

import { mapActions, mapGetters } from "vuex";
import clipboard from "../helper/clipboard";
import notesApi from "../api/notes";

export default {
  name: "note",
  components: {},

  data() {
    return {
      buttonClasses: "font-bold py-3 px-5 sm:py-1 sm:px-3 rounded",
      copied: false
    };
  },

  props: {
    note: {
      type: Object
    },
    index: {
      type: Number
    },
    selected: {
      type: [Number, Boolean],
      default: false
    }
  },

  mounted() {},

  methods: {
    body() {
      return marked(
        this.note.body
          .replace("^c", "<span class='copy'>")
          .replace("c^", "</span>"),
        {
          breaks: true
        }
      );
    },

    deleteNote() {
      this.$confirm(
        "Are you sure you want to delete this note?",
        () => {
          notesApi.delete(this.note).then(() => {
            this.setNoteView(false);
            this.removeNote(this.note._id);
          });
        },
        () => {}
      );
    },

    copyNote() {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 500);

      const copy = notesApi.getCopy(this.note.raw);
      if (copy) {
        clipboard(copy);
      } else {
        clipboard(this.note.raw);
      }
    },

    editNote() {
      this.setNoteView(false);
      this.setEditorStateNote(this.note);
    },

    tagBg(tag) {
      return {
        backgroundColor: tag.color
      };
    },

    ...mapActions([
      "setNoteView",
      "addSelectedTag",
      "removeNote",
      "setEditorStateNote"
    ])
  },

  computed: {
    isNoteView() {
      return !!this.$store.state.noteView;
    },

    active() {
      return this.selected !== false && this.selected == this.index;
    },

    layout() {
      return this.$store.state.settings.layout.cssClass;
    }
  }
};
</script>

<style lang="scss">
.note {
  overflow: hidden;
  width: 50%;
  box-sizing: border-box;
  border: 2px solid white;
  @apply border-2 border-gray-300 bg-white;

  &.active {
    @apply border-gray-500;
  }

  .view-action {
    .svg-icon {
      width: 1.5em;
      height: 1.5em;
    }
  }
}

.copied-text {
  background: #ffffff;
  padding: 0.5rem 1rem;
  transition: opacity 200ms;
  box-shadow: 0px 0px 10px -5px rgba(0, 0, 0, 0.3);
}
.copiedt-enter {
  .copied-text {
    opacity: 0;
  }
}

.copiedt-leave-active {
  .copied-text {
    opacity: 0;
  }
}

.copiedt-enter .copiedt-container,
.copiedt-leave-active .copiedt-container {
  .copied-text {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
}

.note-actions {
  box-shadow: 0px -15px 10px 0px rgba(255, 255, 255, 1);
}
.tag {
  padding: 0.15rem 0.5rem;
}
</style>