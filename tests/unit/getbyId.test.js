// tests/unit/getById.test.js

const request = require('supertest');

const app = require('../../src/app');
//const logger = require('../../src/logger');
const { Fragment } = require('../../src/model/fragment');
const hash = require('crypto');

describe('GETById /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/:id').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/:id')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Using a valid username/password pair with wrong id
  test('authenticated users get fragment with unknown id', async () => {
    var id = 1;
    await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1').expect(404);
  });

  //Using a valid username/password pair with incorrect extension, should return a 415 error
  test('Incorrect Extension', async () => {
    //create a fragment through post
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('abc');

    //get fragment id
    const ownerId = hash.createHash('sha256').update('user1@email.com').digest('hex');
    const savedFragment = await Fragment.byUser(ownerId, true);
    const id = savedFragment.at(0).id;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}.zip`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(415);
  });

  // Using a valid username/password pair with correct extension
  test('Correct .txt extension', async () => {
    //create a fragment through post
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('abc');

    //get fragment id
    const ownerId = hash.createHash('sha256').update('user1@email.com').digest('hex');
    const savedFragment = await Fragment.byUser(ownerId, true);
    const id = savedFragment.at(0).id;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}.txt`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
  });

  // Using a valid username/password pair with correct fragment id, and no extension specified
  test('authenticated users get a fragment with correct fragment id', async () => {
    const data = Buffer.from('abc');
    //create a fragment through post
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send(data);

    //get fragment id
    const ownerId = hash.createHash('sha256').update('user1@email.com').digest('hex');
    const savedFragment = await Fragment.byUser(ownerId, true);
    const id = savedFragment.at(0).id;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toBe(data.toString());
  });
});
