<template>
  <div class="theme" :class="themeClass">
    <div class="py-8 px-1">
      <Drawer
        class="nav-drawer"
        :direction="'right'"
        :exist="true"
        ref="drawer"
        @close="closeDrawer"
      >
        <drawer-content />
      </Drawer>
      <navigation v-if="!isHome" />
      <router-view />
    </div>
  </div>
</template>

<script>
import Mousetrap from "mousetrap";
import { mapActions } from "vuex";

import { Person } from "blockstack";
import { userSession } from "./helper/userSession";

import versionApi from "./api/version";
import settingsApi from "./api/settings";
import notesApi from "./api/notes";

import Navigation from "./components/Navigation";
import Drawer from "./components/Drawer.vue";
import DrawerContent from "./components/DrawerContent.vue";

export default {
  name: "app",
  components: { Drawer, DrawerContent, Navigation },

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
      const tag = (event.target || event.srcElement).tagName.toLowerCase();
      if (tag !== "input" && tag !== "textarea") {
        this.drawer = !this.drawer;
      }
    });

    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      let user = new Person(userData.profile);
      user.username = userData.username;
      this.setUser(user).then(() => {
        versionApi.init().then(() => {
          settingsApi.init();
          notesApi.init();
        });
      });

      if (this.routeBeforeLogin) {
        this.$router.push(this.routeBeforeLogin);
      }
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
      window.location = "https://landing.blocknote.xyz/";
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
    },

    isHome() {
      return this.$route.name === "home";
    },

    themeClass() {
      return this.$store.state.settings.theme.cssClass;
    },

    routeBeforeLogin() {
      return this.$store.state.routeBeforeLogin;
    }
  },

  watch: {
    drawer(n) {
      if (n) {
        this.$refs.drawer.open();
      } else {
        this.$refs.drawer.close();
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

