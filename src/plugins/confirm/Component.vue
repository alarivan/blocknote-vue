<template>
  <div class="fixed inset-0 w-100vw h-100vh z-50 flex flex-wrap justify-center items-center">
    <div class="confirm p-8 border border-gray-300 bg-gray-100 shadow-2xl">
      <p class="flex-auto mb-4">{{message}}</p>
      <div class="actions flex justify-between">
        <button
          @click="yes"
          type="button"
          :class="buttonClasses"
          class="bg-gray-600 hover:bg-gray-700"
        >
          yes
          <span class="hidden sm:inline-block">(y)</span>
        </button>
        <button
          @click="no"
          type="button"
          :class="buttonClasses"
          class="bg-gray-500 hover:bg-gray-600"
        >
          no
          <span class="hidden sm:inline-block">(n)</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Mousetrap from "mousetrap";

export default {
  name: "confirm",
  components: {},
  data() {
    return {
      buttonClasses: "text-white font-bold py-2 px-6 rounded"
    };
  },

  props: {
    message: {
      type: String
    }
  },

  mounted() {
    Mousetrap.bind("y", () => {
      this.yes();
    });
    Mousetrap.bind("n", () => {
      this.no();
    });
  },

  beforeDestroy() {
    Mousetrap.unbind("y", "n");
  },

  methods: {
    yes() {
      this.$root.destroyConfirm(true);
    },
    no() {
      this.$root.destroyConfirm(false);
    }
  }
};
</script>

<style lang="scss">
.confirm {
  width: 300px;
}
</style>