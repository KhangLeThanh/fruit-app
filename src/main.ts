import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/styles/customStyle.css";

import { BootstrapVue3 } from "bootstrap-vue-3";

const app = createApp(App);

// Use BootstrapVue
app.use(BootstrapVue3);

// Use Router
app.use(router);

app.mount("#app");
