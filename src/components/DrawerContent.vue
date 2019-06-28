<template>
  <div class="container mx-auto mb-4 text-right">
    <div v-if="user" class="profile flex px-4 py-2 justify-end">
      <div class="mr-2 text-right text-sm">
        <div>{{user.name()}}</div>
        <div>{{user.username}}</div>
      </div>
      <img v-if="user.avatarUrl()" :src="user.avatarUrl()" alt="avatar" width="40" height="40">
    </div>
    <ul>
      <li>
        <router-link @click="closeDrawer" class="nav-drawer-link" to="/">notes</router-link>
      </li>
      <li>
        <router-link @click="closeDrawer" class="nav-drawer-link" to="/about">about</router-link>
      </li>

      <li v-if="user">
        <router-link @click="closeDrawer" class="nav-drawer-link" to="/settings">settings</router-link>
      </li>
      <li v-if="user">
        <router-link @click="closeDrawer" class="nav-drawer-link" to="/manage">import/export</router-link>
      </li>
      <li v-if="user">
        <button @click="signOut" class="w-full text-right nav-drawer-link">sign out</button>
      </li>
    </ul>
    <div class="p-4">
      <h1 class="font-bold uppercase">settings</h1>
      <Options/>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import Options from "../components/Settings/Options";

export default {
  name: "drawer-content",
  components: { Options },
  data() {
    return {};
  },
  methods: {
    signOut() {
      this.userSession.signUserOut();
      this.removeUser();
      this.$router.push("/login");
    },

    closeDrawer() {
      this.setDrawer(false);
    },

    ...mapActions(["removeUser", "setDrawer", "setEditorStateActive"])
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
</style>