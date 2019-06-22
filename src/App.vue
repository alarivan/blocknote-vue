<template>
  <div>
    <div class="py-2 sm:py-8">
      <a-drawer
        :visible="drawer"
        :closable="false"
        :title="null"
        placement="right"
        wrapClassName="nav-drawer"
        @close="setDrawer(false)"
      >
        <div class="container mx-auto mb-4 text-right">
          <div v-if="user" class="profile flex px-4 py-2 justify-end">
            <div class="mr-2 text-right">
              <div>{{user.name()}}</div>
              <div>{{user.username}}</div>
            </div>
            <picture>
              <source :srcset="smallest_img" media="(max-width: 640px)">
              <img
                v-if="user.avatarUrl()"
                :src="user.avatarUrl()"
                alt="avatar"
                width="40"
                height="40"
              >
            </picture>
          </div>
          <ul>
            <li>
              <router-link @click="closeDrawer" class="nav-drawer-link" to="/">notes</router-link>
            </li>
            <li>
              <router-link @click="closeDrawer" class="nav-drawer-link" to="/about">about</router-link>
            </li>

            <li>
              <router-link @click="closeDrawer" class="nav-drawer-link" to="/howto">how to</router-link>
            </li>
            <li v-if="user">
              <router-link @click="closeDrawer" class="nav-drawer-link" to="/settings">settings</router-link>
            </li>
            <li v-if="user">
              <button @click="signOut" class="w-full text-right nav-drawer-link">sign out</button>
            </li>
          </ul>
        </div>
      </a-drawer>

      <router-view/>
    </div>
  </div>
</template>

<script>
import Mousetrap from "mousetrap";
import { mapActions } from "vuex";

import { Person } from "blockstack";
import { userSession } from "./helper/userSession";

import versionApi from "./api/version";

import Dropdown from "./components/Dropdown";

export default {
  name: "app",
  components: { Dropdown },

  data() {
    return {
      smallest_img: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
    };
  },

  created() {
    this.setUserSession(userSession);

    this.$router.beforeEach((to, from, next) => {
      this.closeDrawer();
      return next();
    });
  },

  mounted() {
    Mousetrap.bind("\\", event => {
      this.drawer = !this.drawer;
    });

    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      let user = new Person(userData.profile);
      console.log(user);
      user.username = userData.username;
      this.setUser(user).then(() => {
        versionApi.init();
      });
      this.$router.push("/");
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(userData => {
        window.location = window.location.origin;
      });
    }
  },

  beforeDestroy() {
    Mousetrap.unbind("\\");
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

    ...mapActions(["setUser", "removeUser", "setUserSession", "setDrawer"])
  },

  computed: {
    user() {
      return this.$store.state.user;
    },

    userSession() {
      return this.$store.state.userSession;
    },

    drawer: {
      get() {
        return this.$store.state.drawer;
      },

      set(value) {
        return this.setDrawer(value);
      }
    }
  }
};
</script>

<style lang="scss">
.profile {
  box-sizing: content-box;
  height: 40px;
}

.nav-drawer {
  .ant-drawer-body {
    padding: 0;
  }

  .nav-drawer-link {
    @apply block text-gray-700 font-bold py-2 px-4;
    &:hover {
      @apply text-gray-900 bg-gray-200;
      text-decoration: underline;
    }
  }
}
</style>

