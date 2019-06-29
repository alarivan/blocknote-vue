<template>
  <div class="sm:hidden fixed action-panel-wrapper z-40">
    <div class="action-panel flex">
      <button class="action-panel-item bg-teal-800" @click="focusSearch">
        <svg class="icon icon-search">
          <use xlink:href="#icon-search" />
        </svg>
      </button>
      <button class="action-panel-item bg-blue-800" @click="setEditorStateActive(true)">
        <svg class="icon">
          <use xlink:href="#icon-plus" />
        </svg>
      </button>
      <button
        v-if="searchInput || selectedTags"
        class="action-panel-item bg-gray-600"
        @click="clearSearch"
      >
        <svg class="icon">
          <use xlink:href="#icon-cross" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "action-panel",

  data() {
    return {};
  },

  methods: {
    clearSearch() {
      this.updateSearch("");
      this.clearSelectedTags();
    },

    focusSearch() {
      this.$emit("focusSearch");
    },

    ...mapActions(["setEditorStateActive", "updateSearch", "clearSelectedTags"])
  },

  computed: {
    user() {
      return this.$store.state.user;
    },

    userSession() {
      return this.$store.state.userSession;
    },

    selectedTags() {
      return this.$store.state.selectedTags.length;
    },

    searchInput() {
      return this.$store.state.search.length;
    }
  }
};
</script>

<style lang="scss">
.action-panel-wrapper {
  bottom: 10px;
  right: 10px;
}
</style>