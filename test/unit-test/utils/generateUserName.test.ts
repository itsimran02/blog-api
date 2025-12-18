import { describe, expect, it } from 'vitest';
import { generateUserName } from '../../../src/utils/index';

describe('generateUsername()', () => {
  it('should generate random username ', () => {
    expect(generateUserName()).toEqual(expect.any(String));
  });
});
