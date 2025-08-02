// webpack common dependency for production and development
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// export webpack default config
module.exports = {
  entry: {
    index: {
      import: path.resolve(__dirname, "..", "./src/index.js"),
    },
  },

  output: {
    path: path.resolve(__dirname, "..", "./build"),
    filename: `[name][contenthash:8].bundle.js`,
  },
  optimization: {
    splitChunks: { chunks: "all" },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "..", "./src/index.html"),
      filename: "index.html",
      chunks: ["index"],
      inject: "body",
    }),
  ],
  module: {
    rules: [
      // babel loader to compile
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      //json
      { test: /\.json$/, type: "json" },
      // Images
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|mp4)$/i,
        type: "asset/resource",
      },
      // Fonts and SVGs
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg)$/,
        type: "asset/inline",
      },

      {
        test: /\.(html)$/,
        exclude: /node_modules/,
        use: {
          loader: "html-loader",
          options: {
            sources: {
              list: [
                "...", // important, to correctly handle the default tags like 'src'
                {
                  tag: "img",
                  attribute: "data-src",
                  type: "src",
                },
              ],
            },
          },
        },
      },
    ],
  },
  devServer: {
    static: path.resolve(__dirname, "./src"),
  },
};
