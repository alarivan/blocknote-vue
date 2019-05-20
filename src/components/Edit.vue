<template>
  <div>
    <div class="flex flex-wrap items-center border-b border-b-2 border-green-500 py-2 mb-2">
      <label
        class="flex-auto uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="note"
      >content (markdown)</label>
      <textarea
        class="mousetrap flex-auto appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none h-56"
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
        placeholder="Example: work, play, joke"
        aria-label="tags"
      >
    </div>
  </div>
</template>

<script>
import marked from "marked";

export default {
  name: "note-edit",
  components: {},

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

  mounted() {},

  methods: {},

  computed: {},

  watch: {
    active: function(n, o) {
      if (n) {
        this.$refs.noteinput.focus();
      }
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
</style>
