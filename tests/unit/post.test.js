// tests/unit/post.test.js
const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');
const hash = require('crypto');
describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', async () =>
    request(app).post('/v1/fragments').expect(401));
  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));
  //A fragment with an unsupported type should give a 415 error response
  test('unsupported types cause a 415 response', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'multipart/form-data')
      .expect(415);
  });
  test('authenticated users can create a plain text fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('This is a fragment');
    const ownerId = hash.createHash('sha256').update('user1@email.com').digest('hex');
    const savedFragment = await Fragment.byUser(ownerId, true);
    expect(res.statusCode).toBe(201);
    //responses include all necessary and expected properties
    expect(savedFragment.at(0).ownerId).toEqual(ownerId);
    expect(savedFragment.at(0).type).toEqual('text/plain');
    expect(savedFragment.at(0).id).toEqual(expect.anything(String));
    expect(savedFragment.at(0).created).toEqual(expect.any(String));
    expect(savedFragment.at(0).updated).toEqual(expect.any(String));
    expect(savedFragment.at(0).size).toEqual(expect.any(Number));
  });
});
