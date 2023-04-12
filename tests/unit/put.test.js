const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {
  //test unauthenticated requests
  test('unauthenticated requests are denied', () =>
    request(app).delete('/v1/fragments/:id').expect(401));

  // Using a valid username/password pair with correct fragment id
  test('authenticated user updates a fragment', async () => {
    const postResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('A fragment');
    var id = JSON.parse(postResponse.text).fragment.id;
    const putResponse = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('Updated fragment');
    expect(putResponse.statusCode).toBe(200);
  });

  test('authenticated users updates an nonexisting fragment', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('A fragment');
    var id = 123;
    const putResponse = await request(app)
      .put(`/v1/fragments/${id}`)
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('Updated fragment');
    expect(putResponse.statusCode).toBe(404);
  });

  // Using a valid username/password pair with correct fragment id but incorrect type
  test('authenticated users update a fragment', async () => {
    const postResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('A fragment');
    var id = JSON.parse(postResponse.text).fragment.id;
    const putResponse = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send('<h1>Updated fragment</h1>');
    expect(putResponse.statusCode).toBe(400);
  });
});
