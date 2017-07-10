const request = require('supertest');
const Koa = require('koa');

describe('middleware : logger', () => {

  let app;

  beforeAll(() => {
    const server = new Koa();
    server.use(require('../../src/middleware/logger'));
    server.use(async ctx => ctx.response.body = 'all good!');
    app = server.listen(9999, 'localhost');
  });

  afterAll(() => {
    app.close();
  });

  test('should log the request and response to console', async () => {
    console.log = jest.fn();
    try {
      const response = await request(app)
        .get('/ping');
      expect(response.statusCode).toBe(200);
      expect(console.log.mock.calls.length).toBe(2);
    } finally {
      console.log.mockRestore();
    }
  });

  test('should return x-response-time header', async () => {
    const response = await request(app)
      .get('/ping');
    expect(response.statusCode).toBe(200);
    expect(response.headers).toMatchObject({
      'x-response-time': expect.stringMatching(/^[0-9,]+ms$/)
    });
  });
});
