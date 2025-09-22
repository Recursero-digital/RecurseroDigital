import request from 'supertest';
import app from '../../src/config/app';

describe('POST /login - Integration Tests', () => {
  describe('Validaciones de parámetros', () => {
    it('debe devolver 400 cuando no se ingresa el parámetro usuario', async () => {
      const res = await request(app)
        .post('/login')
        .send({ password: 'abcd1234' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Falta el usuario');
    });

    it('debe devolver 400 cuando no se ingresa el parámetro password', async () => {
      const res = await request(app)
        .post('/login')
        .send({ user: 'admin' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Falta la contraseña');
    });
  });

  describe('Validaciones de credenciales', () => {
    it('debe devolver 401 cuando el usuario es inválido', async () => {
      const res = await request(app)
        .post('/login')
        .send({ user: 'usuario_inexistente', password: 'abcd1234' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Credenciales inválidas');
    });

    it('debe devolver 401 cuando la contraseña es inválida', async () => {
      const res = await request(app)
        .post('/login')
        .send({ user: 'admin', password: 'password_incorrecta' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Credenciales inválidas');
    });
  });

  describe('Login exitoso', () => {
    it('debe devolver 200 y un token cuando las credenciales son correctas', async () => {
      const res = await request(app)
        .post('/login')
        .send({ user: 'admin', password: 'abcd1234' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.token).toBe('string');
      expect(res.body.token.length).toBeGreaterThan(0);
    });

    it('debe devolver un token JWT válido', async () => {
      const res = await request(app)
        .post('/login')
        .send({ user: 'admin', password: 'abcd1234' });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    });
  });
});
