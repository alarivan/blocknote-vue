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
      <div
        ref="notebody"
        data-scroll-lock-scrollable
        :class="{'show-more': showMore && !isNoteView}"
        class="markdown-body p-3 flex-auto overflow-hidden"
        v-html="body()"
      ></div>
      <div class="flex flex-row-reverse m-2 note-actions z-10">
        <button
          :class="buttonClasses"
          class="note-action bg-red-800 hover:bg-red-900"
          @click="deleteNote()"
          title="delete"
        >
          <svg class="icon mx-auto">
            <use xlink:href="#icon-bin2" />
          </svg>
        </button>
        <button
          :class="buttonClasses"
          class="note-action bg-blue-800 hover:bg-blue-900 mr-2"
          @click="copyNote()"
          title="copy"
        >
          <svg class="icon mx-auto">
            <use xlink:href="#icon-copy" />
          </svg>
        </button>
        <button
          :class="buttonClasses"
          class="note-action bg-orange-500 hover:bg-orange-600 mr-2"
          @click="editNote()"
          title="edit"
        >
          <svg class="icon">
            <use xlink:href="#icon-pencil" />
          </svg>
        </button>
        <button
          title="Close"
          v-if="isNoteView"
          class="view-action w-full mr-2"
          @click="setNoteView(false)"
        >
          <svg class="icon mx-auto">
            <use xlink:href="#icon-cross" />
          </svg>
        </button>
        <button v-else class="view-action w-full mr-2" @click="setNoteView(note)">
          <svg class="icon mx-auto">
            <use xlink:href="#icon-enlarge" />
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

import htmlRenderer from "../plugins/marked/rendrer/html";

export default {
  name: "note",
  components: {},

  data() {
    return {
      buttonClasses: "font-bold py-3 px-5 sm:py-1 sm:px-3 rounded",
      copied: false,
      showMore: false
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

  mounted() {
    this.$nextTick(() => {
      this.showMore =
        this.$refs.notebody.scrollHeight > this.$refs.notebody.clientHeight;
    });
  },

  methods: {
    body() {
      return marked(
        this.note.body
          .replace("^c ", "<span class='copy'>")
          .replace(" c^", "</span>"),
        {
          breaks: true,
          renderer: htmlRenderer
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
  @apply border-2;

  .view-action {
    .svg-icon {
      width: 1.5em;
      height: 1.5em;
    }
  }

  .markdown-body.show-more {
    position: relative;
    &:before {
      content: "...";
      position: absolute;
      bottom: 0px;
      left: 0;
      padding: 0rem 0.75rem;
      width: 100%;
      height: 8px;
      display: block;
      line-height: 0px;
      overflow: visible;
      text-align: center;
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

.tag {
  padding: 0.15rem 0.5rem;
}
</style>