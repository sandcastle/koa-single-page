const boom = require('boom');
const send = require('../helpers/send');
const debug = require('../helpers/debug');

const RULES = {
  index: '/index.html',
  root: '/',
  allowedVerbs: ['GET'],
};

function isNotStaticFile(ctx) {
  return ctx.path.indexOf('.') === -1;
}

function isIndexPath(ctx) {
  return ctx.path === RULES.index;
}

function isInvalidVerb(ctx) {
  return !RULES.allowedVerbs.some(x => x === ctx.method.toUpperCase());
}

module.exports = async (ctx, next) => {

  if (isNotStaticFile(ctx)) {
    debug.log(ctx, 'assets : not static file');
    return await next();
  }

  if (isIndexPath(ctx)) {
    debug.log(ctx, 'assets : direct index.html reference');
    ctx.status = 301;
    ctx.redirect(RULES.root);
    return;
  }

  if (isInvalidVerb(ctx)) {
    debug.log(ctx, 'spa : invalid verb');
    ctx.set('Allow', 'GET,OPTIONS');
    ctx.setError(boom.methodNotAllowed('Method not allowed'));
    return;
  }

  await send(ctx, ctx.path);
}
