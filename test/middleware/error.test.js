const request = require('supertest');
const Koa = require('koa');
const boom = require('boom');

describe('middleware : error', () => {

  let app;

  beforeAll(() => {
    let server = new Koa();
    server.use(require('../../src/middleware/error'));
    server.use(async (ctx) => {
      if(ctx.path == '/400') return ctx.setError(boom.badRequest('Straight boom'));
      if(ctx.path == '/throw') throw new Error('bad things');
      if(ctx.path == '/ctx-throw') ctx.throw(501, 'not implemented');
    });
    app = server.listen(9999, 'localhost');
  });

  afterAll(() => {
    app.close();
  });

  test('should honour boom error if set', async () => {
    const response = await request(app)
      .get('/400');
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Straight boom');
  });

  test('should wrap error if unhandled', async () => {
    const response = await request(app)
      .get('/throw');
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe('An internal server error occurred');
  });

  test('should wrap error when thrown from context', async () => {
    const response = await request(app)
      .get('/ctx-throw');
    expect(response.statusCode).toBe(501);
    expect(response.body.message).toBe('not implemented');
  });
});
