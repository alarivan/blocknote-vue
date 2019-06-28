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
    <div class="mb-2">
      <label for="settings[actionPanel]" class="flex items-center py-2">
        <div class="mr-2">
          <svg v-if="actionPanel" class="icon icon-checkbox-checked">
            <use xlink:href="#icon-checkbox-checked"></use>
          </svg>
          <svg v-else class="icon icon-checkbox-unchecked">
            <use xlink:href="#icon-checkbox-unchecked"></use>
          </svg>
        </div>
        <span>Show Action Panel (Only Mobile)</span>
      </label>
      <input
        class="invisible"
        v-model="actionPanel"
        type="checkbox"
        id="settings[actionPanel]"
        name="settings[actionPanel]"
      >
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
    ...mapActions(["setSettingsOption", "setSettingsValue"])
  },

  computed: {
    layout: {
      get() {
        return this.$store.state.settings.layout;
      },
      set(value) {
        this.setSettingsOption({ key: "layout", data: value });
      }
    },

    theme: {
      get() {
        return this.$store.state.settings.theme;
      },
      set(value) {
        this.setSettingsOption({ key: "theme", data: value });
      }
    },

    actionPanel: {
      get() {
        return this.$store.state.settings.actionPanel;
      },
      set(value) {
        this.setSettingsValue({ key: "actionPanel", value });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
