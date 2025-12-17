import supertest from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../src/app';

const request = supertest(app);
const API_STRING = '/api/v1';
const email = 'imran@gmail.com';
const password = '1234567890';
describe('POST /delete-user', () => {
  it('should register the user', async () => {
    await request.post(`${API_STRING}/auth/register`).send({
      email,
      password,
    });
    const loginResponse = await request.post(`${API_STRING}/auth/login`).send({
      email,
      password,
    });

    const { accessToken } = loginResponse.body;

    const deleteResponse = await request
      .delete(`${API_STRING}/users/delete`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual(
      expect.objectContaining({
        message: 'user deleted successfully',
        success: true,
        user: expect.any(Object),
      }),
    );
  });
});
