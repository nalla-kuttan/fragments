// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    
  });

  test('returns 404 for unauthenticated users', async () => {
    const res = await request(app)
      .post('/fragments')
      .set('Content-Type', 'text/plain')
      .send('hello, world!');

    expect(res.statusCode).toBe(404);
  });

  test('returns 404 for unsupported Content-Type', async () => {
    const res = await request(app)
      .post('/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/octet-stream')
      .send(Buffer.from([0x01, 0x02, 0x03]));

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error.message', 'not found');
  });
});