<template>
  <div class="container mx-auto mb-4">
    <router-link class="navigation-link" to="/">notes</router-link>

    <router-link class="navigation-link" to="/about">about</router-link>

    <router-link class="navigation-link" to="/howto">how to</router-link>

    <router-link v-if="user" class="navigation-link" to="/settings">settings</router-link>

    <router-link v-if="user" class="navigation-link" to="/manage">import/export</router-link>

    <button v-if="user" @click="signOut" class="navigation-link">sign out</button>
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
    ...mapActions(["removeUser"])
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
.navigation-link {
  @apply py-2 px-4;
  &:hover {
    @apply underline;
  }
}
</style>