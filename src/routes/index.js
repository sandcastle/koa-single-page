const compose = require('koa-compose');
const Router = require('koa-router');

const router = new Router();
router.get('/ping', require('./ping'));
router.get('/not-found', require('./notFound'));

module.exports = compose([
  router.routes(),
  router.allowedMethods()
]);
