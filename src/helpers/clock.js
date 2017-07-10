const moment = require('moment');

module.exports = {
  utcNow() {
    return moment.utc();
  }
};
