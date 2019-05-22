<template>
  <div
    :id="note._id"
    v-bind:class="{ active: active }"
    class="flex flex-col note bg-indigo-100 p-2"
  >
    <div class="flex flex-row-reverse">
      <button
        class="bg-red-400 hover:bg-red-500 text-white font-bold py-1 px-3 mb-2 rounded"
        @click="deleteNote()"
        title="delete"
      >
        <svg class="svg-icon" viewBox="0 0 20 20">
          <path
            d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"
          ></path>
        </svg>
      </button>
      <button
        class="bg-blue-400 hover:bg-blue-500 text-white font-bold py-1 px-3 mb-2 rounded mr-2"
        @click="copyNote()"
        title="copy"
      >
        <svg class="svg-icon" viewBox="0 0 20 20">
          <path
            d="M17.391,2.406H7.266c-0.232,0-0.422,0.19-0.422,0.422v3.797H3.047c-0.232,0-0.422,0.19-0.422,0.422v10.125c0,0.232,0.19,0.422,0.422,0.422h10.125c0.231,0,0.422-0.189,0.422-0.422v-3.797h3.797c0.232,0,0.422-0.19,0.422-0.422V2.828C17.812,2.596,17.623,2.406,17.391,2.406 M12.749,16.75h-9.28V7.469h3.375v5.484c0,0.231,0.19,0.422,0.422,0.422h5.483V16.75zM16.969,12.531H7.688V3.25h9.281V12.531z"
          ></path>
        </svg>
      </button>
      <button
        class="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-3 mb-2 rounded mr-2"
        @click="editNote()"
        title="edit"
      >
        <svg class="svg-icon" viewBox="0 0 20 20">
          <path
            d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"
          ></path>
        </svg>
      </button>
    </div>
    <div class="markdown-body p-3 flex-auto" v-html="body()"></div>
    <div v-if="note.tags.length" class="flex">
      <template v-for="(tag, index) in note.tags">
        <div
          :key="index"
          :style="tagBg(tag)"
          class="tag border border-indigo-100 text-xs font-bold text-gray-800 mt-2"
          :title="tag.name"
        >{{tag.name}}</div>
      </template>
    </div>
  </div>
</template>

<script>
import marked from "marked";

export default {
  name: "note",
  components: {},

  data() {
    return {};
  },

  props: {
    note: {
      type: Object,
      default: 100
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
          .replace("~c", "<span class='copy'>")
          .replace("c~", "</span>")
      );
    },

    deleteNote() {
      this.$emit("deleteNote", this.note);
    },

    copyNote() {
      this.$emit("copyNote", this.note);
    },

    editNote() {
      this.$emit("editNote", this.note);
    },

    tagBg(tag) {
      return {
        backgroundColor: tag.color
      };
    }
  },

  computed: {
    active() {
      return this.selected !== false && this.selected == this.index;
    }
  }
};
</script>

<style lang="scss">
.note {
  width: 50%;
  box-sizing: border-box;
  border: 2px solid white;

  &.active {
    border-color: #2b6cb0;
  }
}
.copy {
  // border: 1px dotted;
}

.tag {
  padding: 0.15rem 0.5rem;
}
</style>
