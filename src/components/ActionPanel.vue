<template>
  <div class="sm:hidden fixed action-panel-wrapper z-40">
    <div class="action-panel flex">
      <button class="action-panel-item bg-blue-800" @click="setEditorStateActive(true)">
        <svg class="icon">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
      <button class="action-panel-item bg-gray-700" @click="clearSearch">
        <svg class="icon">
          <use xlink:href="#icon-cross"></use>
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

    ...mapActions(["setEditorStateActive", "updateSearch", "clearSelectedTags"])
  },

  computed: {
    user() {
      return this.$store.state.user;
    },

    userSession() {
      return this.$store.state.userSession;
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