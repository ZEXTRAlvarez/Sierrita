import { createDefaultParentConfig } from './defaultParentConfig';

describe('createDefaultParentConfig', () => {
  it('starts with no PIN set (empty sentinel hash)', () => {
    expect(createDefaultParentConfig('p1').pinHash).toBe('');
  });

  it('defaults to a 30-minute session limit', () => {
    expect(createDefaultParentConfig('p1').maxSessionMinutes).toBe(30);
  });

  it('enables all 3 worlds by default', () => {
    expect(createDefaultParentConfig('p1').worldsEnabled).toEqual([
      'jungle',
      'ocean',
      'space',
    ]);
  });

  it('carries through the given profileId', () => {
    expect(createDefaultParentConfig('abc-123').profileId).toBe('abc-123');
  });
});
