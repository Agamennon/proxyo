'use strict';

var webpack = require('webpack');
var path = require('path')


var env = process.env.NODE_ENV;
var config = {
  devtool:'source-map',
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename:'proxyo.js',
    library: 'proxyo',
    libraryTarget: 'umd'
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      umd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
      umd: 'react-dom',
    },
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
