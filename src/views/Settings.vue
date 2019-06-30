<template>
  <div class="container mx-auto relative px-2">
    <Options class="w-full sm:w-1/2 mx-auto py-2 mb-8" />
    <div class="w-full sm:w-1/2 mx-auto py-2 mb-8">
      <button
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        :disabled="resetting"
        @click="reset"
      >Reset Tutorial Notes</button>
      <p
        class="text-xs mt-1"
      >IMPORTANT: This will remove all the tutorial notes and create them again in their initial state.</p>
    </div>
    <div class="w-full sm:w-1/2 mx-auto py-2 mb-8">
      <button
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        :disabled="resetting"
        @click="clear"
      >Clear Tutorial Notes</button>
      <p class="text-xs mt-1">IMPORTANT: This will remove all the tutorial notes.</p>
    </div>
  </div>
</template>

<script>
import Options from "../components/Settings/Options";

import { resetTutorialNotes, clearTutorialNotes } from "../api/tutorial";

export default {
  name: "settings",
  components: { Options },
  data() {
    return {
      resetting: false
    };
  },

  methods: {
    reset() {
      this.resetting = true;
      resetTutorialNotes().then(() => {
        this.resetting = false;
        this.$router.push("/");
      });
    },

    clear() {
      this.resetting = true;
      clearTutorialNotes().then(() => {
        this.resetting = false;
        this.$router.push("/");
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>