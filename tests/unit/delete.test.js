const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /v1/fragments/:id', () => {
  //test unauthenticated requests
  test('unauthenticated requests are denied', () =>
    request(app).delete('/v1/fragments/:id').expect(401));

  // Using a valid username/password pair with correct fragment id
  test('authenticated user deletes a fragment', async () => {
    const postResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('A fragment');
    var id = JSON.parse(postResponse.text).fragment.id;
    const deleteResponse = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');
    expect(deleteResponse.statusCode).toBe(200);
  });

  // Using a valid username/password pair with incorrect fragment id
  test('authenticated users deletes a fragment with wrong fragment id', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('A fragment');
    var id = 123;
    const deleteResponse = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');
    expect(deleteResponse.statusCode).toBe(404);
  });
});
