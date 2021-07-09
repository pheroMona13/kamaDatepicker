const path = require('path'),
  webpack = require('webpack'),
  package = require('./package.json'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
  buildMode = 'production'; // 'development' or 'production'

module.exports = {
  mode: buildMode,
  entry: {
    kamadatepicker: ['./src/kamadatepicker.js'],
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: getPlugins(),
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: buildMode === 'development',
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};

function getPlugins() {
  let plugins = [
    new MiniCssExtractPlugin({ filename: 'kamadatepicker.min.css' }),
  ];

  if (buildMode === 'production') {
    plugins.push(
      new webpack.BannerPlugin(`${package.name} - version ${package.version}`)
    );
    plugins.push(new OptimizeCssAssetsPlugin());
  } else if (buildMode === 'development') {
    plugins.push(
      new webpack.BannerPlugin({
        banner: '/* @ sourceURL=[name].js */',
        raw: true,
      })
    );
  }

  return plugins;
}
