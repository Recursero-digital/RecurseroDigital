import request from 'supertest';
import app from '../../src/config/app';

describe('Student Integration Tests', () => {
  
  describe('POST /student', () => {
      it('should return created 201 when add student successfully', async () => {
          const studentData = {
              name: 'Juan',
              lastName: 'Pérez',
              username: 'juan.perez',
              password: 'password123',
              dni: '12345678'
          };

          const res = await request(app)
              .post('/student')
              .send(studentData);

          expect(res.statusCode).toBe(201);
          expect(res.body).toHaveProperty('message', 'Estudiante creado exitosamente');
      });

      it('should return bad request 400 when required parameter left', async () => {
          const studentData = {
              lastName: 'Pérez',
              username: 'juan.perez',
              password: 'password123',
              dni: '12345678'
              // Falta 'name'
          };

          const res = await request(app)
              .post('/student')
              .send(studentData);

          expect(res.statusCode).toBe(400);
          expect(res.body).toHaveProperty('error');
      });

      it('should return bad request 400 when required parameter is empty', async () => {
          const studentData = {
              name: '',
              lastName: 'Pérez',
              username: 'juan.perez',
              password: 'password123',
              dni: '12345678'
          };

          const res = await request(app)
              .post('/student')
              .send(studentData);

          expect(res.statusCode).toBe(400);
          expect(res.body).toHaveProperty('error');
      });

      it('should return conflict 409 when username already exists', async () => {
          const studentData = {
              name: 'Juan',
              lastName: 'Pérez',
              username: 'nico@gmail.com',
              password: 'password123',
              dni: '12345678'
          };

          const res = await request(app)
              .post('/student')
              .send(studentData);

          expect(res.statusCode).toBe(409);
          expect(res.body).toHaveProperty('error', 'El nombre de usuario ya existe');
      });
  });
});