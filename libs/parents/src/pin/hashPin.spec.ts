import { createHash } from 'crypto';

jest.mock('expo-crypto', () => ({
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
  digestStringAsync: jest.fn(async (_algorithm: string, data: string) =>
    createHash('sha256').update(data).digest('hex'),
  ),
}));

import { hashPin } from './hashPin';

describe('hashPin', () => {
  it('produces a 64-character hex string (SHA-256)', async () => {
    const hash = await hashPin('1234');

    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('matches the known SHA-256 digest for a given input', async () => {
    const expected = createHash('sha256').update('1234').digest('hex');

    await expect(hashPin('1234')).resolves.toBe(expected);
  });

  it('is deterministic for the same input', async () => {
    const a = await hashPin('1234');
    const b = await hashPin('1234');

    expect(a).toBe(b);
  });

  it('produces different hashes for different inputs', async () => {
    const a = await hashPin('1234');
    const b = await hashPin('4321');

    expect(a).not.toBe(b);
  });
});
