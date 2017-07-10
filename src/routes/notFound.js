const send = require('../helpers/send');

module.exports = async (ctx) => {
  await send(ctx, 'not-found.html');
};
