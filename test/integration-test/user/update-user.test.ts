import { describe, it, expect } from 'vitest';

import supertest from 'supertest';
import app from '../../../src/app';

const request = supertest(app);
const API_STRING = '/api/v1';
const email = 'email@gmail.com';
const password = '12345678';
describe('PATCH /update the current user', () => {
  it('should update the user details ', async () => {
    const registerResponse = await request
      .post(`${API_STRING}/auth/register`)
      .send({
        email,
        password,
      });
    expect(registerResponse.status).toBe(201);
    const accessToken = registerResponse.body.accessToken;

    const updateResponse = await request
      .patch(`${API_STRING}/users/update`)
      .send({
        email: 'updated@gmail.com',
        userName: 'updatedUser',
      })
      .set('Authorization', `Bearer ${accessToken}`);

    expect(updateResponse.status).toBe(201);
    expect(updateResponse.body).toEqual(
      expect.objectContaining({
        message: 'user updated successfully',
        success: true,
        updatedUser: expect.objectContaining({
          _id: expect.any(String),
          userName: expect.any(String),
          email: expect.any(String),
          role: 'user',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: expect.any(Number),
        }),
      }),
    );
  });
});
