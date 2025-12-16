import supertest from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../src/app';

const request = supertest(app);
const API_STRING = '/api/v1/auth';
const email = 'login@gmail.com';
const password = '123456778';

describe('POST /logout', () => {
  it('should logout logged in user', async () => {
    await request.post(`${API_STRING}/register`).send({
      email,
      password,
    });

    const loginResponse = await request.post(`${API_STRING}/login`).send({
      email,
      password,
    });
    const refreshToken = loginResponse.headers['set-cookie'];

    const logoutResponse = await request
      .post(`${API_STRING}/logout`)
      .set('Cookie', refreshToken);

    expect(logoutResponse.status).toBe(201);
    expect(logoutResponse.body).toEqual(
      expect.objectContaining({
        message: 'user logged out successully',
        success: true,
      }),
    );
  });
});
