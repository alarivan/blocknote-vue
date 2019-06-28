<template>
  <div class="container mx-auto mb-4">
    <div class="flex items-center relative">
      <h1 class="text-center text-3xl flex-auto">{{title}}</h1>
      <div class="nav-actions absolute right-0 flex pr-2">
        <button @click="home" class="mr-3 text-center">
          <svg class="icon icon-home">
            <use xlink:href="#icon-home3"></use>
          </svg>
        </button>
        <button @click="setDrawer(true)" class="text-center">
          <svg class="icon icon-menu">
            <use xlink:href="#icon-menu"></use>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "navigation",

  data() {
    return {};
  },
  methods: {
    home() {
      this.$router.push("/");
    },

    ...mapActions(["setDrawer"])
  },

  computed: {
    title() {
      return this.$route.meta.title;
    }
  }
};
</script>

<style lang="scss">
.nav-actions {
  top: 6px;

  button {
    .icon-home {
      width: 1.75rem;
      height: 1.75rem;
    }
    .icon-menu {
      width: 2rem;
      height: 2rem;
    }
  }
}
</style>