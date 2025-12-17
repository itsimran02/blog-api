import { describe, it, expect } from 'vitest';

import supertest from 'supertest';
import app from '../../../src/app';

const request = supertest(app);
const API_STRING = '/api/v1';
const email = 'email@gmail.com';
const password = '12345678';
describe('GET /get-user', () => {
  it('should get the user details ', async () => {
    const registerResponse = await request
      .post(`${API_STRING}/auth/register`)
      .send({
        email,
        password,
      });
    expect(registerResponse.status).toBe(201);
    const accessToken = registerResponse.body.accessToken;

    const getResponse = await request
      .get(`${API_STRING}/users/current`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual(
      expect.objectContaining({
        success: true,
        user: expect.objectContaining({
          _id: expect.any(String),
          userName: expect.any(String),
          email: email,
          role: 'user',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      }),
    );
  });
});
