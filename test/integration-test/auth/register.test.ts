import supertest from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../src/app';

const request = supertest(app);
const userMail = 'imran@gmail.com';

const userPassword = '12345678';
describe('POST /register', () => {
  it('should register new user ', async () => {
    const response = await request.post('/api/v1/auth/register').send({
      email: userMail,
      password: userPassword,
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: 'User registered successfully',
        accessToken: expect.any(String),
        user: expect.objectContaining({
          email: userMail,
          role: 'user',
          userName: expect.any(String),
        }),
      }),
    );
  });
  it('should register new user ', async () => {
    const response = await request.post('/api/v1/auth/register').send({
      email: userMail,
      password: userPassword,
    });

    expect(response.status).toBe(400);

    expect(response.body).toEqual(
      expect.objectContaining({
        success: false,
        message: 'validation error',

        error: expect.objectContaining({
          email: expect.any(Object),
        }),
      }),
    );
  });
});
