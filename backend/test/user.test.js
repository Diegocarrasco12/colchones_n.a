const request = require('supertest');
const { app, server } = require('../server');

describe('Pruebas de autenticación', () => {
  afterAll(() => {
    server.close(); // 🔹 Cierra el servidor después de las pruebas
  });

  test('Debe registrar un usuario', async () => {
    const res = await request(app).post('/api/users/register').send({
      email: 'test@example.com',
      password: 'test123',
    });
    expect(res.statusCode).toBe(201);
  });

  test('Debe permitir el inicio de sesión', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: 'test@example.com',
      password: 'test123',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
