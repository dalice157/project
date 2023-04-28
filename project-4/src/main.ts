import { createApp } from "vue";

import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import "@/assets/scss/reset.scss";
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer";
import filtertime from "@/util/dayjs";
import Vue3linkify from "vue-3-linkify"; // https://libraries.io/npm/vue-3-linkify 套件參考

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(filtertime);
app.use(Viewer);
app.use(Vue3linkify);
app.mount("#app");
