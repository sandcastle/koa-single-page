async function logger(ctx, next) {
  console.log(`--> ${ctx.method} ${ctx.url}`);
  const start = new Date();
  await next();
  const ms = Math.ceil(Date.now() - start);
  ctx.set('X-Response-Time', `${ms}ms`);
  console.log(`<-- ${ctx.method} ${ctx.url} ${ctx.status} (${ms}ms)`);
}

module.exports = () => logger;
