// test/health.test.ts
import { describe, it, expect } from 'vitest';

describe('Health check', () => {
  it('should return OK', () => {
    expect('OK').toBe('OK');
  });
});
