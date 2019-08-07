const path = require("path"),
  webpack = require("webpack"),
  package = require("./package.json"),
  UglifyJSPlugin = require("uglifyjs-webpack-plugin"),
  ExtractTextPlugin = require("extract-text-webpack-plugin"),
  extractSass = new ExtractTextPlugin({ filename: "kamadatepicker.min.css" }),
  buildMode = "production"; // 'development' or 'production'

module.exports = {
  entry: {
    kamadatepicker: ["./src/kamadatepicker.js"]
  },
  output: {
    filename: "[name].min.js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: getPlugins(),
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: extractSass.extract({
          use: [
            {
              loader: "css-loader",
              options:
                buildMode === "production"
                  ? { minimize: true }
                  : { sourceMap: true }
            },
            {
              loader: "sass-loader",
              options: buildMode === "production" ? {} : { sourceMap: true }
            }
          ]
        })
      },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          query: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};

function getPlugins() {
  let plugins = [extractSass];

  if (buildMode === "production") {
    plugins.push(new UglifyJSPlugin());
    plugins.push(
      new webpack.BannerPlugin(`${package.name} - version ${package.version}`)
    );
  } else if (buildMode === "development") {
    plugins.push(
      new webpack.BannerPlugin({ banner: "/* @ sourceURL=[name].js */", raw: true })
    );
  }

  return plugins;
}
