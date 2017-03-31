const path = require('path');
const webpack = require("webpack");

process.noDeprecation = true;
//process.traceDeprecation = true
module.exports = [{
  name: 'client',
  entry: [
    'webpack-hot-middleware/client?timeout=2000&overlay=true&reload=true',
    path.resolve(__dirname, './web/view/start.js'),
  ],
  devtool:'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [{
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              ["es2015", {"modules": false}],
              "react"

            ],
            plugins:["transform-decorators-legacy","transform-class-properties",],
          }
        }],
        exclude: /node_modules/
      }]
  },

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath:'/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
}
];

