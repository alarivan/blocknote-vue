import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VModal from "vue-js-modal";
import VueCodemirror from "vue-codemirror";

import Confirm from "./plugins/confirm/index";

import "./styles/main.scss";
import "../node_modules/github-markdown-css";

import "codemirror/lib/codemirror.css";

Vue.config.productionTip = false;

Vue.use(new Confirm(Vue));
Vue.use(VModal);
Vue.use(VueCodemirror);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
