const request = require('supertest');
const Koa = require('koa');
const mime = require('../../src/helpers/mime');
const config = require('../../src/config');
const error = require('../../src/middleware/error');
const spa = require('../../src/middleware/spa');

describe.only('middleware : spa', () => {

  let app;

  beforeAll(() => {
    config.useTestFiles();

    const server = new Koa();
    server.use(error());
    server.use(spa());
    server.use(async (ctx, next) => {
      if (/^\/index\.html$/.test(ctx.path)) {
        ctx.body = 'index file';
        return;
      }
      await next();
    });
    server.use(async (ctx) => {
      ctx.response.body = 'wrong';
    });
    app = server.listen(9999, 'localhost');
  });

  afterAll(() => {
    app.close();
  });

  test('should skip if static file requested', async () => {
    const response = await request(app)
      .get('/app.js')
      .set('Accept', mime.js);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('wrong');
  });

  test('should strip trailing /', async () => {
    const response = await request(app)
      .get('/tasks/all/')
      .set('Accept', mime.html);
    expect(response.statusCode).toBe(301);
    expect(response.headers.location).toBe('/tasks/all');
  });

  test('should return error if invalid verb', async () => {
    const response = await request(app)
      .post('/tasks/all')
      .set('Accept', mime.html);
    expect(response.statusCode).toBe(405);
  });

  test('should return the index for the root', async () => {
    const response = await request(app)
      .get('/')
      .set('Accept', mime.html);
    expect(response.statusCode).toBe(200);
    expect(response.text.trim()).toBe('index file');
  });

  test('should return the index for another route', async () => {
    const response = await request(app)
      .get('/tasks/all')
      .set('Accept', mime.html);
    expect(response.statusCode).toBe(200);
    expect(response.text.trim()).toBe('index file');
  });
});
