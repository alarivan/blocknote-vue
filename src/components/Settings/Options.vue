<template>
  <div class>
    <div class="mb-2">
      <label class="block">Layout</label>
      <select v-model="layout" class="settings-select">
        <option
          v-for="(option, index) in options.layout"
          :key="index"
          :value="option"
        >{{option.label}}</option>
      </select>
    </div>
    <div class="mb-2">
      <label class="block">Theme</label>
      <select v-model="theme" class="settings-select">
        <option
          v-for="(option, index) in options.theme"
          :key="index"
          :value="option"
        >{{option.label}}</option>
      </select>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import { options } from "../../constants/settings";

export default {
  name: "settings-options",
  data() {
    return {
      options: {}
    };
  },

  mounted() {
    this.options = options;
  },

  methods: {
    ...mapActions(["setLayout", "setSettingsOption"])
  },

  computed: {
    layout: {
      get() {
        return this.$store.state.settings.layout;
      },
      set(value) {
        this.setLayout(value);
      }
    },

    theme: {
      get() {
        return this.$store.state.settings.theme;
      },
      set(value) {
        this.setSettingsOption({ key: "theme", data: value });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
