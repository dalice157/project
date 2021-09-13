require("dotenv").config();
const plugins = require('./src/plugins')

module.exports = {
  telemetry: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "104scb-50talent-frontend-web",
    htmlAttrs: {
      lang: "en"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  srcDir: "src",
  routerModule: {
    path: "."
  },
  router: {
    base: "/50talent"
  },
  dotenv: {
    path: "."
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["./assets/scss/custom.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins,

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    "@nuxtjs/style-resources" // 加入這個可以讓 SCSS 變數不用在每支檔案 import
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/axios", "bootstrap-vue/nuxt"],
  bootstrapVue: {
    bootstrapCSS: false, // Or `css: false`
    bootstrapVueCSS: false // Or `bvCSS: false`
  },
  axios: {
    baseURL: `${process.env.BASE_URL}/50talent`,
    browserBaseURL: `${process.env.BROWSER_BASE_URL}/50talent`, // config.SERVER_URL || 'http://localhost:3333'
    credentials: true
  },

  styleResources: {
    scss: ["./assets/scss/_var.scss"]
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true
  },

  server: {
    // Doc: https://nuxtjs.org/faq/host-port/#configure-in-code-nuxt-config-js-code-
    port: process.env.NODE_ENV === "production" ? 8080 : 8083
  }
};
