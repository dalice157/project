import { createApp } from "vue";

import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import filtertime from "./util/dayjs";
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer";
import "./assets/scss/reset.scss";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(filtertime);
app.use(Viewer);
app.mount("#app");
