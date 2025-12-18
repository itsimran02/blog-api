import { describe, it, expect } from 'vitest';

import supertest from 'supertest';
import app from '../../../src/app';

const request = supertest(app);
const API_STRING = '/api/v1';
const email = 'admin@gmail.com';
const password = '12345678';
describe('GET /users', () => {
  it('should get all the users  ', async () => {
    const registerResponse = await request
      .post(`${API_STRING}/auth/register`)
      .send({
        email,
        password,
        role: 'admin',
      });
    expect(registerResponse.status).toBe(201);
    const accessToken = registerResponse.body.accessToken;

    const getResponse = await request
      .get(`${API_STRING}/users?offset=1&limit=10`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(getResponse.status).toBe(200);

    expect(getResponse.body).toEqual(
      expect.objectContaining({
        message: 'users fetched successfully',
        success: true,
        total: expect.any(Number),
        offset: 1,
        limit: 10,
        users: [],
      }),
    );
  });
});
