import supertest from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../src/app';

const request = supertest(app);

describe('Integration Test: Health Check', () => {
  it('GET /api/v1/ should return 200 and success message', async () => {
    const response = await request.get('/api/v1/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: 'Api is live',
        version: '1.0.0',
      }),
    );
  });
});
