const clock = require('../helpers/clock');

module.exports = async (ctx) => {
  ctx.response.type = 'text/plain';
  ctx.response.body = `${clock.utcNow().toISOString()}`;
};

