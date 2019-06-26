<template>
  <div class="container mx-auto mb-4">
    <div class="flex items-center relative">
      <h1 class="text-center text-3xl flex-auto">{{title}}</h1>
      <button
        @click="setDrawer(true)"
        class="hambutton ml-2 w-16 pr-2 text-center absolute right-0"
      >
        <svg class="icon icon-menu mx-auto">
          <use xlink:href="#icon-menu"></use>
        </svg>
      </button>
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
    signOut() {
      this.userSession.signUserOut();
      this.removeUser();
      this.$router.push("/login");
    },

    ...mapActions(["removeUser", "setDrawer"])
  },

  computed: {
    user() {
      return this.$store.state.user;
    },

    userSession() {
      return this.$store.state.userSession;
    },

    title() {
      return this.$route.meta.title;
    }
  }
};
</script>

<style lang="scss">
.navigation-link {
  @apply py-2 px-4;
  &:hover {
    @apply underline;
  }
}

.hambutton {
  top: 6px;
}
</style>