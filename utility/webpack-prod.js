import MiniCssExtractPlugin, {
  loader as _loader,
} from "mini-css-extract-plugin";

const date = new Date();
let stringDate = date.toDateString().split(" ").join("");

export const mode = "production";
export const devtool = "source-map";
export const module = {
  rules: [
    {
      test: /\.(scss|css)$/,
      use: [
        _loader,
        {
          loader: "css-loader",
          options: {
            importLoaders: 2,
            sourceMap: false, // don't allow original source code in the browser
            modules: false,
          },
        },

        "sass-loader",
      ],
    },
  ],
};
export const plugins = [
  // Extracts CSS into separate files
  new MiniCssExtractPlugin({
    filename: `styles/[name]${stringDate}.css`,
    chunkFilename: "[name].css",
  }),
];
