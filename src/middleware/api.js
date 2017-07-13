const proxy = require('koa-proxy');
const config = require('../config');

module.exports = () => proxy({
  host: config.api,
  match: /^\/api\//
});
