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
          <svg class="svg-icon fill-current" viewBox="0 0 20 20">
            <path
              d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"
            ></path>
          </svg>
        </button>
        <button
          :class="buttonClasses"
          class="bg-blue-800 hover:bg-blue-900 text-white mr-2"
          @click="copyNote()"
          title="copy"
        >
          <svg class="svg-icon fill-current" viewBox="0 0 20 20">
            <path
              d="M17.391,2.406H7.266c-0.232,0-0.422,0.19-0.422,0.422v3.797H3.047c-0.232,0-0.422,0.19-0.422,0.422v10.125c0,0.232,0.19,0.422,0.422,0.422h10.125c0.231,0,0.422-0.189,0.422-0.422v-3.797h3.797c0.232,0,0.422-0.19,0.422-0.422V2.828C17.812,2.596,17.623,2.406,17.391,2.406 M12.749,16.75h-9.28V7.469h3.375v5.484c0,0.231,0.19,0.422,0.422,0.422h5.483V16.75zM16.969,12.531H7.688V3.25h9.281V12.531z"
            ></path>
          </svg>
        </button>
        <button
          :class="buttonClasses"
          class="bg-orange-500 hover:bg-orange-600 text-white mr-2"
          @click="editNote()"
          title="edit"
        >
          <svg class="svg-icon fill-current" viewBox="0 0 20 20">
            <path
              d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"
            ></path>
          </svg>
        </button>
        <button class="view-action w-full mr-2 hover:bg-gray-100" @click="setNoteView(note)">
          <svg class="svg-icon mx-auto" viewBox="0 0 20 20">
            <path
              d="M8.627,7.885C8.499,8.388,7.873,8.101,8.13,8.177L4.12,7.143c-0.218-0.057-0.351-0.28-0.293-0.498c0.057-0.218,0.279-0.351,0.497-0.294l4.011,1.037C8.552,7.444,8.685,7.667,8.627,7.885 M8.334,10.123L4.323,9.086C4.105,9.031,3.883,9.162,3.826,9.38C3.769,9.598,3.901,9.82,4.12,9.877l4.01,1.037c-0.262-0.062,0.373,0.192,0.497-0.294C8.685,10.401,8.552,10.18,8.334,10.123 M7.131,12.507L4.323,11.78c-0.218-0.057-0.44,0.076-0.497,0.295c-0.057,0.218,0.075,0.439,0.293,0.495l2.809,0.726c-0.265-0.062,0.37,0.193,0.495-0.293C7.48,12.784,7.35,12.562,7.131,12.507M18.159,3.677v10.701c0,0.186-0.126,0.348-0.306,0.393l-7.755,1.948c-0.07,0.016-0.134,0.016-0.204,0l-7.748-1.948c-0.179-0.045-0.306-0.207-0.306-0.393V3.677c0-0.267,0.249-0.461,0.509-0.396l7.646,1.921l7.654-1.921C17.91,3.216,18.159,3.41,18.159,3.677 M9.589,5.939L2.656,4.203v9.857l6.933,1.737V5.939z M17.344,4.203l-6.939,1.736v9.859l6.939-1.737V4.203z M16.168,6.645c-0.058-0.218-0.279-0.351-0.498-0.294l-4.011,1.037c-0.218,0.057-0.351,0.28-0.293,0.498c0.128,0.503,0.755,0.216,0.498,0.292l4.009-1.034C16.092,7.085,16.225,6.863,16.168,6.645 M16.168,9.38c-0.058-0.218-0.279-0.349-0.498-0.294l-4.011,1.036c-0.218,0.057-0.351,0.279-0.293,0.498c0.124,0.486,0.759,0.232,0.498,0.294l4.009-1.037C16.092,9.82,16.225,9.598,16.168,9.38 M14.963,12.385c-0.055-0.219-0.276-0.35-0.495-0.294l-2.809,0.726c-0.218,0.056-0.351,0.279-0.293,0.496c0.127,0.506,0.755,0.218,0.498,0.293l2.807-0.723C14.89,12.825,15.021,12.603,14.963,12.385"
            ></path>
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