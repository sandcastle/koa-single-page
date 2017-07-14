const boom = require('boom');
const send = require('../helpers/send');
const debug = require('../helpers/debug');

const RULES = {
  allowedVerbs: ['GET', 'OPTIONS'],
  stripSlash: true,
  index: '/index.html',
  root: '/'
};

function isInvalidVerb(ctx) {
  return !RULES.allowedVerbs.some(x => x === ctx.method.toUpperCase());
}

function hasBody(ctx) {
  return !!ctx.request.body || !ctx.request.idempotent;
}

function isStaticFile(ctx) {
  return ctx.path.indexOf('.') > -1;
}

function shouldRedirectWithoutSlash(ctx) {
  return ctx.path.length > 2
      && ctx.path.slice(-1) === RULES.root
      && RULES.stripSlash;
}

function isIndexPath(ctx) {
  return ctx.path === RULES.index;
}

function acceptsHtml(headers) {
  return !!headers
      && typeof headers.accept === 'string'
      && (headers.accept.indexOf('text/html') !== -1 || headers.accept.indexOf('*/*') !== -1);
}

async function spa(ctx, next) {

  if (isStaticFile(ctx)) {
    await next();
    return;
  }

  if (isInvalidVerb(ctx)) {
    debug.log(ctx, 'spa : invalid verb');
    ctx.set('Allow', 'GET,OPTIONS');
    ctx.setError(boom.methodNotAllowed('Method not allowed'));
    return;
  }

  if (hasBody(ctx)) {
    debug.log(ctx, 'spa : has body');
    ctx.setError(boom.badRequest('Request had body'));
    return;
  }

  if (!acceptsHtml(ctx.headers)) {
    debug.log(ctx, 'spa : does not accept html');
    await next();
    return;
  }

  if (shouldRedirectWithoutSlash(ctx)) {
    debug.log(ctx, 'spa : has trailing slash');
    ctx.status = 301;
    ctx.redirect('back', ctx.path.slice(0, -1));
    return;
  }

  if (isIndexPath(ctx)) {
    debug.log(ctx, 'spa : direct index.html reference');
    ctx.status = 301;
    ctx.redirect('back', RULES.root);
    return;
  }

  ctx.path = RULES.index;

  await next();
}

module.exports = () => spa;
