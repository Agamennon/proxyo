
const path = require('path');
//const render = require ('./render.js');
//require ('./render.js');


const express = require('express');
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpack = require("webpack");
const webpackConfig = require("../webpack.server.config");


const app = express();

const compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
  publicPath: "/", // Same as `output.publicPath` in most cases.
  //   contentBase: "/dist",
  hot:true,
  noInfo:true,
  stats: {
    progress:true,
    colors: true
  },
  quiet:false
}));

app.use(require("webpack-hot-middleware")(compiler, {
  heartbeat: 2000
}));

app.use('/', express.static(path.join(__dirname,'/view')));


app.listen(4000, () => {
  // devServer();
  console.log('Example app listening on port 4000!')
});