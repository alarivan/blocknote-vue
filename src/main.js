import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import Confirm from "./plugins/confirm/index";

import "./styles/main.scss";
import "../node_modules/github-markdown-css";
import "../node_modules/easymde/dist/easymde.min.css";

Vue.config.productionTip = false;

Vue.use(new Confirm(Vue));

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
