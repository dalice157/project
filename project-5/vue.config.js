const webpack = require("webpack");
const { HashedModuleIdsPlugin } = require("webpack");
const path = require("path");

const isProduction = process.env.NODE_ENV === "production";
console.log("NODE_ENV", process.env.NODE_ENV);
console.log("VUE_APP_outputDir", process.env.VUE_APP_outputDir);
console.log("VUE_APP_config", process.env.VUE_APP_config);

function resolve(dir) {
    return path.join(__dirname, dir);
}
const BASE_URL = isProduction ? "/" : "/";

module.exports = {
    publicPath: BASE_URL,
    assetsDir: "static",
    outputDir: process.env.VUE_APP_outputDir,
    indexPath: "index.html",
    productionSourceMap: false, //不生成map
    chainWebpack: (config) => {
        config.output.filename("static/js/[name].[hash:8].js");
        config.output.chunkFilename("static/js/[name].[hash:8].js");
        if (isProduction) {
            config.optimization.minimizer("terser").tap((args) => {
                // 註解console
                args[0].terserOptions.compress.drop_console = true;
                // remove debugger
                args[0].terserOptions.compress.drop_debugger = true;
                // 移除 console.log
                args[0].terserOptions.compress.pure_funcs = [
                    "console.log",
                    "console.error",
                    "console.warn",
                ];
                // 去掉註解, 如需要看chunk-verdors 部份插件, 可以註解掉
                args[0].terserOptions.output = {
                    comments: false,
                };
                return args;
            });
        }
        // config.optimization.minimize(false);
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
    configureWebpack: (config) => {
        if (isProduction) {
            // 公共代码抽离
            config.optimization = {
                splitChunks: {
                    cacheGroups: {
                        vendor: {
                            chunks: "all",
                            test: /node_modules/,
                            name: "vendor",
                            minChunks: 1,
                            maxInitialRequests: 5,
                            minSize: 0,
                            priority: 100,
                        },
                        common: {
                            chunks: "all",
                            test: /[\\/]src[\\/]js[\\/]/,
                            name: "common",
                            minChunks: 2,
                            maxInitialRequests: 5,
                            minSize: 0,
                            priority: 60,
                        },
                        styles: {
                            name: "styles",
                            test: /\.(sa|sc|c)ss$/,
                            chunks: "all",
                            enforce: true,
                        },
                        runtimeChunk: {
                            name: "manifest",
                        },
                    },
                },
            };
        }
    },
    devServer: {
        open: true, // 自动打开浏览器
        port: 1234, // 端口
    },
};
