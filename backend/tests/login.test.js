const request = require('supertest');
const app = require('../app');

describe('POST /login', () => {

  it('should return 200 and tokens for valid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ user: 'user1', password: 'abcd123456' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should return 400 when user has no received', async () => {
        const res = await request(app)
            .post('/login')
            .send({ password: 'abcd123456'});

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Falta el usuario');
    });

});
