import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { Modal } from "ant-design-vue";
import { Drawer } from "ant-design-vue";

import Confirm from "./plugins/confirm/index";

import "./styles/main.scss";
import "../node_modules/github-markdown-css";
import "ant-design-vue/dist/antd.css";
import "tui-editor/dist/tui-editor.css";
import "tui-editor/dist/tui-editor-contents.css";
import "codemirror/lib/codemirror.css";

Vue.config.productionTip = false;

Vue.use(new Confirm(Vue));
Vue.use(Modal);
Vue.use(Drawer);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
