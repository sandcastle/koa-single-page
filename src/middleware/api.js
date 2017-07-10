const compose = require('koa-compose');
const proxy = require('koa-proxies');
const conf = require('../config');

const api = proxy('/api', {
  changeOrigin: true,
  target: conf.api,
  logs: true
});

module.exports = api;

