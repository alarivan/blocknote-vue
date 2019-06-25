<template>
  <div class>
    <div class="mb-2">
      <label class="block">Layout</label>
      <select v-model="layout">
        <option
          v-for="(option, index) in options.layout"
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
    ...mapActions(["setLayout"])
  },

  computed: {
    layout: {
      get() {
        return this.$store.state.settings.layout;
      },
      set(value) {
        this.setLayout(value);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
