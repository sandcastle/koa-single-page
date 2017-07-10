const request = require('supertest');
const Koa = require('koa');
const mime = require('../../src/helpers/mime');
const config = require('../../src/config');

describe('middleware : spa', () => {

  let app;

  beforeAll(() => {
    config.useTestFiles();

    const server = new Koa();
    server.use(require('../../src/middleware/error'));
    server.use(require('../../src/middleware/spa'));
    server.use(async ctx => ctx.response.body = 'wrong');
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
