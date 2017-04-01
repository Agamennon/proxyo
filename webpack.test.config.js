const path = require('path');
const webpack = require("webpack");
var nodeExternals = require('webpack-node-externals');


process.noDeprecation = true;
//process.traceDeprecation = true
module.exports = {
  target:'node',
  externals: [nodeExternals()],
  devtool:'source-map',
 // devtool:'#inline-cheap-module-source-map',
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
  }/*,
  output: {
    devtoolModuleFilenameTemplate        : '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  }*/

}
;

