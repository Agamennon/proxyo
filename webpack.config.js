'use strict';

var webpack = require('webpack');
var path = require('path')


var env = process.env.NODE_ENV;
var config = {

  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename:'proxyo.js',
    library: 'proxyo',
    libraryTarget: 'umd'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })

  ]
};

module.exports = config;



/*
module: {
  rules: [
    {
      test: /\.jsx?$/,

      use: [{
        loader: 'babel-loader',
        options:{
          //         retainLines:true,
          babelrc:false,
          presets: [
            ["es2015", {"modules": false}],
            "stage-2",
            "react"
          ],
          plugins: [ "transform-decorators-legacy","transform-class-properties"]
        }
      }],

      exclude: /node_modules/

    }
  ],
},*/
