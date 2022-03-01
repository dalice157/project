import { createApp } from "vue";
import { createPinia } from "pinia";
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer";

import App from "./App.vue";
import router from "./router";
import filtertime from "@/util/dayjs";
import "@/assets/scss/reset.scss";
import "@/assets/scss/ui.scss";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(filtertime);
app.use(Viewer);
app.mount("#app");
