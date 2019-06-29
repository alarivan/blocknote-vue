<template>
  <div class="w-full flex flex-wrap items-center">
    <div class="w-full flex flex-wrap flex-auto border-b border-b-2 border-gray-500 py-2 mb-1">
      <input
        ref="search"
        class="search mousetrap appearance-none bg-transparent border-none py-1 px-2 leading-tight focus:outline-none flex-auto"
        type="text"
        placeholder="press '/' to focus, type '?' for help"
        aria-label="search"
        v-model="searchInput"
      />
      <slot></slot>
    </div>
    <div
      v-if="this.searchInput === '?'"
      class="w-full text-xs"
    >press "enter" or "," to select the first tag, "backspace" in empty search to remove last tag</div>
    <div class="selected-tags border-l-2">
      <button
        v-for="(tag, index) in selected"
        :key="index"
        @click="remove(tag)"
        class="relative tag"
        :style="{ backgroundColor: tag.color }"
      >{{tag.name}}</button>
    </div>
    <div class="w-full">
      <div
        @click="add(tag)"
        class="tag tag-sggestion text-xs font-bold cursor-pointer"
        v-for="(tag, index) in filtered"
        :key="index"
      >{{tag.name}}</div>
    </div>
  </div>
</template>

<script>
import Mousetrap from "mousetrap";
import { mapActions, mapGetters } from "vuex";
import Fuse from "fuse.js";

const options = {
  shouldSort: true,
  findAllMatches: true,
  threshold: 0.3,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["name"]
};

export default {
  name: "tag-input",
  data() {
    return {
      model: ""
    };
  },

  props: {
    placeholder: { type: String },
    label: { type: String }
  },

  mounted() {
    Mousetrap.bind("/", event => {
      const tag = (event.target || event.srcElement).tagName.toLowerCase();
      if (tag !== "input" && tag !== "textarea") {
        event.preventDefault();
        // this.exitSelectMode();
        // this.editMode(false);
        this.focus();
      }
    });

    Mousetrap.bind("enter", event => {
      if (event.target == this.$refs.search) {
        event.preventDefault();
        this.addFirstFiltered();
      }
    });

    Mousetrap.bind(",", event => {
      if (event.target == this.$refs.search) {
        event.preventDefault();
        this.addFirstFiltered();
      }
    });

    Mousetrap.bind("backspace", event => {
      if (event.target == this.$refs.search) {
        if (this.selected.length && this.searchInput === "") {
          event.preventDefault();
          this.remove(this.selected[this.selected.length - 1]);
        }
      }
    });

    Mousetrap.bind("r r", event => {
      const tag = (event.target || event.srcElement).tagName.toLowerCase();
      if (tag !== "input" && tag !== "textarea") {
        event.preventDefault();
        this.clear();
      }
    });
  },

  beforeDestroy() {
    Mousetrap.unbind("/");
    Mousetrap.unbind("enter");
    Mousetrap.unbind(",");
    Mousetrap.unbind("backspace");
    Mousetrap.unbind("r r");
  },

  methods: {
    add(tag) {
      this.addSelectedTag(tag);
      this.searchInput = "";
    },

    remove(tag) {
      this.removeSelectedTag(tag);
    },

    clear() {
      this.searchInput = "";
      this.clearSelectedTags();
    },

    focus() {
      this.$refs.search.focus();
    },

    addFirstFiltered() {
      if (this.filtered.length) {
        this.add(this.filtered[0]);
      }
    },

    ...mapActions([
      "updateSearch",
      "clearSelectedTags",
      "setSelectedTags",
      "addSelectedTag",
      "removeSelectedTag"
    ])
  },

  computed: {
    searchInput: {
      get() {
        return this.$store.state.search;
      },
      set(value) {
        this.updateSearch(value);
      }
    },

    tags() {
      return this.$store.state.tags;
    },

    selected() {
      return this.$store.state.selectedTags;
    },

    filtered() {
      if (this.searchInput !== "") {
        let fuse = new Fuse(this.tags, options); // "list" is the item array
        let result = fuse.search(this.searchInput);

        return result.filter(t => {
          return !this.selected.includes(t);
        });
      }

      return [];
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
