const webpack = require("webpack");

module.exports = {
    //基本路径
    publicPath: "./",
    //输出文件目录
    outputDir: "./dist",
    productionSourceMap: false, //不生成map
    // configureWebpack: {
    //     plugins: [
    //         // janus.js does not use 'import' to access to the functionality of webrtc-adapter,
    //         // instead it expects a global object called 'adapter' for that.
    //         // Let's make that object available.
    //         new webpack.ProvidePlugin({ adapter: ["webrtc-adapter", "default"] }),
    //     ],
    //     module: {
    //         rules: [
    //             // janus.js does not use 'export' to provide its functionality to others, instead
    //             // it creates a global variable called 'Janus' and expects consumers to use it.
    //             // Let's use 'exports-loader' to simulate it uses 'export'.
    //             {
    //                 test: require.resolve("janus-gateway"),
    //                 loader: "exports-loader",
    //                 options: {
    //                     exports: "Janus",
    //                 },
    //             },
    //         ],
    //     },
    // },
};
