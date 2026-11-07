const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

require('./setup');

describe('Authentication & User Endpoints', () => {
  it('should register a new customer successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Customer',
        email: 'customer@test.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('customer@test.com');
    expect(res.body.user.role).toBe('customer');
  });

  it('should reject registration with existing email', async () => {
    await User.create({
      name: 'Existing User',
      email: 'customer@test.com',
      password: 'password123',
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another User',
        email: 'customer@test.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should login an existing user with correct credentials', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login User',
      email: 'login@test.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'login@test.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject login with wrong password', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login User',
      email: 'login@test.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'login@test.com',
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should retrieve authenticated user profile with valid Bearer token', async () => {
    const regRes = await request(app).post('/api/auth/register').send({
      name: 'Profile User',
      email: 'profile@test.com',
      password: 'password123',
    });

    const token = regRes.body.token;

    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.name).toBe('Profile User');
  });
});
