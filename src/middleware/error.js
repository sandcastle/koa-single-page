const boom = require('boom');

function setError(ctx) {
  return (err) => {
    const b = !err.isBoom
        ? boom.wrap(err, err.statusCode || err.status || 500)
        : err;
    ctx.response.body = b.output.payload;
    ctx.response.status = b.output.statusCode;
  };
}

async function error(ctx, next) {
  ctx.setError = setError(ctx);
  try {
    await next();
  }
  catch (err) {
    console.error(err);
    ctx.setError(err);
  }
}

module.exports = () => error;
