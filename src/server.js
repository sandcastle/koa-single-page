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
app.use(assets());

module.exports = app;
