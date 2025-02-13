const path = require("path");
const ExtReloader = require("webpack-ext-reloader");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        content: "./src/js/content.js",
        worker: "./src/js/worker.js",
        popup: "./src/js/popup.js",
        menu: "./src/js/menu.js",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.html$/,
                use: ["html-loader"],
            },
        ],
    },
    optimization: {
        minimize: false, // This helps avoid eval()
    },
    devtool: false, // Disable source maps
    plugins: [
        ...(process.env.NODE_ENV === "development" //conditional prevents hotload disabled warning on prod build
            ? [
                  new ExtReloader({
                      port: 9090,
                      reloadPage: true,
                      entries: {
                          background: "worker",
                          contentScript: "content",
                          extensionPage: ["popup", "menu"],
                      },
                  }),
              ]
            : []),
        new HtmlWebpackPlugin({
            template: "./src/html/popup.html",
            filename: "popup.html",
            chunks: ["popup"],
            inject: "body",
        }),
        new HtmlWebpackPlugin({
            template: "./src/html/menu.html",
            filename: "menu.html",
            chunks: ["menu"],
            inject: "body",
        }),
    ],
};
