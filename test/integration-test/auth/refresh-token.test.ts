import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import app from '../../../src/app';

const request = supertest(app);
const API_STRING = '/api/v1/auth';
const email = 'imran@gmail.com';
const password = '12345785';
describe('POST /refresh-token', () => {
  it('should return the access token', async () => {
    const loginResponse = await request.post(`${API_STRING}/register`).send({
      email,
      password,
    });

    const refreshToken = loginResponse.headers['set-cookie'];

    const refreshResponse = await request
      .post(`${API_STRING}/refresh-token`)
      .set('Cookie', refreshToken);

    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      }),
    );
  });
});
