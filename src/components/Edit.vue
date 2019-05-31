<template>
  <div class="mx-1 sm:mx-0 mb-2">
    <div class="mb-2">
      <label
        ref="edittoplabel"
        class="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="note"
      >content (markdown)</label>
      <textarea
        class="mousetrap"
        ref="noteinput"
        id="note"
        :value="noteInput"
        v-on:input="$emit('update:noteInput', $event.target.value)"
      ></textarea>
    </div>
    <div class="flex flex-wrap items-center border-b border-b-2 border-green-500 py-2 mb-2">
      <label
        class="flex-auto uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="note"
      >tags</label>
      <input
        ref="tags"
        :value="tagsInput"
        v-on:input="$emit('update:tagsInput', $event.target.value)"
        class="mousetrap flex-auto appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
        type="text"
        placeholder="work, play, joke"
        aria-label="tags"
      >
    </div>
    <div class="flex">
      <button
        @click="save"
        class="save-button fixed shadow-2xl sm:shadow-none sm:static flex-auto py-2 px-6 border border-teal-500 bg-teal-500 hover:bg-teal-600 hover:border-teal-600 rounded text-white font-bold sm:mr-2 z-20"
      >
        save
        <span class="hidden sm:inline-block">( alt + enter )</span>
      </button>
      <button
        @click="cancel"
        class="py-2 px-4 w-full sm:w-auto border border-gray-500 hover:border-gray-600 rounded font-bold text-gray-700"
      >
        cancel
        <span class="hidden sm:inline-block">( esc )</span>
      </button>
    </div>
  </div>
</template>

<script>
import marked from "marked";
import EasyMDE from "easymde";

import TagInput from "./TagInput";

export default {
  name: "note-edit",
  components: { TagInput },

  data() {
    return {
      note: "",
      tags: ""
    };
  },

  props: {
    noteInput: {
      type: String,
      default: ""
    },
    tagsInput: {
      type: String,
      default: ""
    },
    active: {
      type: Boolean,
      default: false
    }
  },

  mounted() {
    this.easyMDE = new EasyMDE({
      element: this.$refs.noteinput,
      autofocus: true
    });
    this.easyMDE.codemirror.on("change", () => {
      this.$emit("update:noteInput", this.easyMDE.value());
    });
  },

  methods: {
    save() {
      this.$emit("save");
    },

    cancel() {
      this.$emit("cancel");
    }
  },

  computed: {},

  watch: {
    active: function(n, o) {
      if (n) {
        this.$refs.edittoplabel.scrollIntoView(true);
        this.easyMDE.codemirror.focus();
        this.easyMDE.value(this.noteInput);
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

.editor-toolbar,
.CodeMirror.cm-s-easymde.CodeMirror-wrap {
  border-radius: 0;
}
</style>
