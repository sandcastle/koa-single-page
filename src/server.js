require('dotenv').config();

const Koa = require('koa');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const compress = require('koa-compress');
const api = require('./middleware/api');
const error = require('./middleware/error');
const logger = require('./middleware/logger');
const spa = require('./middleware/spa');
const assets = require('./middleware/assets');
const routes = require('./routes');

const app = new Koa();
app.use(error());
app.use(logger());
app.use(compress());
app.use(api());
app.use(routes);
app.use(conditional());
app.use(etag());
app.use(spa());
if (isDevelopment()) {
  app.use(dev());
}
app.use(assets());

function dev() {
  /* eslint-disable global-require */
  const webpack = require('webpack');
  const { devMiddleware } = require('koa-webpack-middleware');
  const compile = webpack(require('../config/webpack.dev'));
  return devMiddleware(compile, {
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    index: 'index.html',
    publicPath: '/',
    stats: {
      colors: true
    }
  });
}

function isDevelopment() {
  const DEV = 'development';
  return (process.env.NODE_ENV || DEV) === DEV;
}

module.exports = app;
