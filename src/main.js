import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import "@aws-amplify/ui-components";

import {
  applyPolyfills,
  defineCustomElements,
} from "@aws-amplify/ui-components/loader";

import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";
Amplify.configure(awsconfig);

Vue.config.ignoredElements = [/amplify-\w*/];

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

// Import Bootstrap an BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

applyPolyfills().then(() => {
  defineCustomElements(window);
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
