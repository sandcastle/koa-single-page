const clock = require('./clock');

test('can mock clock', async () => {
  clock.utcNow.mockReturnValue(222);
  expect(clock.utcNow()).toBe(222);
});
