const request = require('supertest');
const server = require('../server');

const clock = '../../mocks/clock';

// 2017-07-09T05:34:52.259Z
const RegexIso8601 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

describe('GET /ping', () => {

  test('should return the current UTC time as ISO 8601 in the body', async () => {
    const response = await request(server)
      .get('/ping');
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual(expect.stringMatching(RegexIso8601));
    expect(response.type).toBe('text/plain');
  });
});

