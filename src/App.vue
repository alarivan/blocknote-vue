<template>
  <div class="py-8 h-full">
    <div v-if="user">
      <div class="container mx-auto mb-4">
        <div class="flex">
          <router-link class="text-gray-700 hover:text-gray-900 font-bold py-2 px-4" to="/">notes</router-link>

          <router-link
            class="text-gray-700 hover:text-gray-900 font-bold py-2 px-4"
            to="/about"
          >about</router-link>
          <div class="flex-auto"></div>
          <div class="profile flex ml-1">
            <img width="40" height="40" :src="user.avatarUrl()">
            <button
              class="text-gray-700 hover:text-gray-900 font-bold py-2 px-4"
              @click="signOut"
            >sign out</button>
          </div>
        </div>
      </div>
      <router-view/>
    </div>
    <login v-else/>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import { Person } from "blockstack";
import { userSession } from "./helper/userSession";

import Login from "./components/Login";

export default {
  name: "app",
  components: { Login },

  data() {
    return {};
  },

  created() {
    this.setUserSession(userSession);
  },

  mounted() {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      let user = new Person(userData.profile);
      user.username = userData.username;
      this.setUser(user);
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(userData => {
        window.location = window.location.origin;
      });
    }
  },

  methods: {
    signOut() {
      this.userSession.signUserOut();
      this.removeUser();
    },
    ...mapActions(["setUser", "removeUser", "setUserSession"])
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
.profile {
  display: flex;
  height: 40px;
}
</style>

