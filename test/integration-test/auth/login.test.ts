import supertest from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../src/app';

const request = supertest(app);
const API_STRING = '/api/v1/auth';
const email = 'login@gmail.com';
const password = '123456778';
describe('POST /login', () => {
  it('should register the user', async () => {
    const response = await request.post(`${API_STRING}/register`).send({
      email,
      password,
    });
  });
  it('should login the user', async () => {
    const response = await request.post(`${API_STRING}/login`).send({
      email,
      password,
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'logged in successfully',
        success: true,
        accessToken: expect.any(String),
        user: expect.objectContaining({
          userName: expect.any(String),
          email: email,
          role: 'user',
        }),
      }),
    );
  });
});
