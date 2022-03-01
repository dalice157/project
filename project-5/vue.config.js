const webpack = require("webpack");
const path = require("path");

const isProduction = process.env.NODE_ENV === "production";
function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    chainWebpack: (config) => {
        // 添加别名
        config.resolve.alias
            .set("@", resolve("src"))
            .set("assets", resolve("src/assets"))
            .set("views", resolve("src/views"))
            .set("store", resolve("src/store"))
            .set("utils", resolve("src/util"))
            .set("config", resolve("src/config"))
            .set("components", resolve("src/components"));
    },
    configureWebpack: {
        plugins: [
            // janus.js does not use 'import' to access to the functionality of webrtc-adapter,
            // instead it expects a global object called 'adapter' for that.
            // Let's make that object available.
            new webpack.ProvidePlugin({ adapter: ["webrtc-adapter", "default"] }),
        ],
        module: {
            rules: [
                // janus.js does not use 'export' to provide its functionality to others, instead
                // it creates a global variable called 'Janus' and expects consumers to use it.
                // Let's use 'exports-loader' to simulate it uses 'export'.
                {
                    test: require.resolve("janus-gateway"),
                    loader: "exports-loader",
                    options: {
                        exports: "Janus",
                    },
                },
            ],
        },
    },
};
