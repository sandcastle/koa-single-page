const request = require('supertest');
const Koa = require('koa');
const config = require('../../src/config');
const mime = require('../../src/helpers/mime');
const error = require('../../src/middleware/error');
const assets = require('../../src/middleware/assets');

describe('middleware : error', () => {

  let app;

  beforeAll(() => {
    config.useTestFiles();

    const server = new Koa();
    server.use(error());
    server.use(assets());
    server.use(async (ctx) => {
      ctx.response.body = 'wrong';
    });
    app = server.listen(9999, 'localhost');
  });

  afterAll(() => {
    app.close();
  });

  test('should ignore routes', async () => {
    const response = await request(app)
      .get('/tasks/all')
      .set('Accept', mime.html);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('wrong');
  });

  test('should return static css file', async () => {
    const response = await request(app)
      .get('/app.css')
      .set('Accept', mime.css);
    expect(response.statusCode).toBe(200);
    expect(response.text.indexOf('.cow { color: red; }')).toBeGreaterThan(-1);
  });

});
