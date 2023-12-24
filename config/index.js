"use strict";
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require("path");
module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: "static",
    assetsPublicPath: "/",
    // proxyTable: proxyConfig.proxy,
    // Various Dev Server settings
    proxyTable: {
      "/apis": {
        // target: "http://admin.cosysong.com",//设置你调用的接口域名和端口号
        // target: "http://admin.wy24.com/",//设置你调用的接口域名和端口号
        // target: "http://admin.wsdy.net/",//设置你调用的接口域名和端口号 test
        target: "https://adminapitest.51renqijie.com/",//设置你调用的接口域名和端口号 test-now
        // target: "https://admin.gosdy.com/",//设置你调用的接口域名和端口号 生产环境
        // target: "https://admin.presdy.net",//设置你调用的接口域名和端口号 pre
        // target: "https://adminapitestqq.99yipintao.com",//设置你调用的接口域名和端口号 test
        // target: "https://admin.wsdydev.net",//设置你调用的接口域名和端口号 dev
        // target: "https://admin.presdy.net",//设置你调用的接口域名和端口号 pre
        // target: "https://admin.evebcomp.com/",//设置你调用的接口域名和端口号
        // target: "http://192.168.7.131:8080", // Jet
        // target: "http://192.168.7.104:8080", // Gray
        // target: 'http://192.168.7.108:8080', // Lebron
        // target: 'http://192.168.7.119:8082', // tony
        // target: 'http://192.168.7.117:8080', // liam
        //  target: "http://192.168.7.102:8060", // LG
        // target: 'http://admin.evebzd03.com',  //limit
        // target: 'http://192.168.7.111:8080',
        //secure: true, // 如果是https接口，需要配置这个参数
        changeOrigin: true, //跨域(这个参数是用来回避跨站问题的，配置完之后发请求时会自动修改http header里面的host，但是不会修改别的)
        pathRewrite: {
          "^/apis": "" //路径的替换规则
        }
      }
    },
    host:"localhost", // can be overwritten by process.env.HOST
    port: 9091, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    devtool: "cheap-module-eval-source-map",
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    // devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, "../dist/index.html"),

    // Paths
    assetsRoot: path.resolve(__dirname, "../dist"),
    assetsSubDirectory: "static",
    assetsPublicPath: "/",

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: "#source-map",

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ["js", "css"],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
};
