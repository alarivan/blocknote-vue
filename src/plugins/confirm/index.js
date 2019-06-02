import Component from "./Component";
import Vue from "vue";

// // This exports the plugin object.
// export default {
//   // The install method will be called with the Vue constructor as
//   // the first argument, along with possible options
//   install(Vue, options) {
//     Vue.prototype.$confirm = function(message, callback) {
//       // Create plugin's root Vue instance
//       const root = new Vue({
//         render: createElement => createElement(Component)
//       });

//       root.$mount(document.body.appendChild(document.createElement("div")));
//     };
//   }
// };

class Plugin {
  constructor(Vue, options) {
    this.Vue = Vue;
    this.mounted = false;
    this.$root = {};
    this.options = options;
  }

  install(Vue, options) {
    Vue.prototype.$confirm = (message, yes, no) => {
      this.open(message, yes, no);
    };
  }

  open(message, yes, no) {
    this.destroy();

    this.yes = yes;
    this.no = no;

    this.mount(message);
  }

  destroy(confirmation) {
    if (this.mounted === true) {
      if (confirmation) {
        this.yes();
      } else {
        this.no();
      }

      let elem = this.$root.$el;
      this.$root.$destroy();
      this.$root.$off();
      elem.remove();
      this.mounted = false;

      this.yes = false;
      this.no = false;
    }
  }

  mount(message) {
    if (this.mounted === true) {
      return;
    }

    this.$root = (() => {
      const v = new Vue({
        methods: {
          destroyConfirm: confirmation => {
            this.destroy(confirmation);
          }
        },
        render: createElement =>
          createElement(Component, {
            props: {
              message: message
            }
          })
      });

      return v.$mount(
        document
          .querySelector("body")
          .appendChild(document.createElement("div"))
      );
    })();

    this.mounted = true;
  }
}

export default Plugin;
