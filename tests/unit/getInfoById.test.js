// tests/unit/getByIdInfo.test.js

const request = require('supertest');

const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');
const hash = require('crypto');

describe('GET /v1/fragments/:id/info', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get(`/v1/fragments/id/info`).expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/:id/info')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Using a valid username/password pair with wrong id
  test('authenticated users get fragment with unknown id', async () => {
    var id = 1;
    await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user1@email.com', 'password1')
      .expect(404);
  });

  // Using a valid username/password pair with correct fragment id
  test('authenticated users get fragment metadata', async () => {
    const data = Buffer.from('abc');
    //create a fragment through post
    const pRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send(data);

    //get fragment id
    const ownerId = hash.createHash('sha256').update('user1@email.com').digest('hex');
    const gettingID = await Fragment.byUser(ownerId, true);
    const id = gettingID.at(0).id;
    var savedFragment = JSON.parse(pRes.text).fragment;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
    var result = JSON.parse(getRes.text).fragments;
    expect(result).toEqual(savedFragment);
  });
});
