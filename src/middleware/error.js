const compose = require('koa-compose');
const boom = require('boom');

const setError = (ctx) => {
  return (err) => {
    let _boom = !err.isBoom
      ? boom.wrap(err, err.statusCode || err.status || 500)
      : err;
    ctx.response.body = _boom.output.payload;
    ctx.response.status =  _boom.output.statusCode;
  };
};

module.exports = async (ctx, next) => {
  ctx.setError = setError(ctx);
  try {
    await next();
  }
  catch (err) {
    console.error(err);
    ctx.setError(err);
  }
};
