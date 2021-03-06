const config = require('../config');

module.exports = {
  log(ctx, message) {
    if (config.debug) {
      console.log(`${message} (${ctx.method} ${ctx.path})`);
    }
  }
};
