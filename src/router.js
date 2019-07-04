import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

import store from "./store";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        requiresAuth: true,
        title: "Home",
        layout: "default"
      }
    },
    {
      path: "/about",
      name: "about",
      meta: {
        title: "About",
        layout: "default"
      },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/settings",
      name: "settings",
      meta: {
        requiresAuth: true,
        title: "Settings",
        layout: "default"
      },
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Settings.vue")
    },
    {
      path: "/manage",
      name: "manager",
      meta: {
        requiresAuth: true,
        title: "Import/Export",
        layout: "default"
      },
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Manager.vue")
    },
    {
      path: "/login",
      name: "login",
      meta: {
        title: "Login",
        layout: "simple"
      },
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Login.vue")
    },
    {
      path: "/howto",
      name: "howto",
      meta: {
        title: "How To",
        layout: "default"
      },
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Howto.vue")
    }
  ]
});

router.beforeEach((to, from, next) => {
  store.dispatch("setDrawer", false);
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.state.user == null) {
      store.dispatch("setRouteBeforeLogin", to.fullPath);

      next({
        path: "/login"
      });

      return;
    } else {
      next();
    }
  } else if (to.matched.some(record => record.name === "login")) {
    if (store.state.user == null) {
      next();
    } else {
      next({ name: "home" });
    }
  } else {
    next();
  }
});

export default router;
