const request = require('supertest');
const Koa = require('koa');

describe('middleware : api', () => {

  let app;
  let api;

  beforeAll(() => {

    const apiServer = new Koa();
    apiServer.use(async (ctx) => {
      ctx.response.type = 'application/json';
      ctx.response.body = '{ "success": true }';
    });
    api = apiServer.listen(9998, 'localhost');

    process.env.API_URL = 'http://localhost:9998';

    const appServer = new Koa();
    appServer.use(require('../../src/middleware/api'));
    app = appServer.listen(9999, 'localhost');
  });

  afterAll(() => {
    app.close();
    api.close();
  });

  test('should pass through call the API', async () => {
    const response = await request(app)
      .get('/api/test');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('{ "success": true }');
  });
});
