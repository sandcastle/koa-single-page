const clock = require('../../src/helpers/clock');
clock.utcNow = jest.fn();

module.exports = clock;
