import { createHash } from 'crypto';

jest.mock('expo-crypto', () => ({
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
  digestStringAsync: jest.fn(async (_algorithm: string, data: string) =>
    createHash('sha256').update(data).digest('hex'),
  ),
}));

import { verifyPin } from './verifyPin';
import { hashPin } from './hashPin';

describe('verifyPin', () => {
  it('returns true when the pin matches the stored hash', async () => {
    const hash = await hashPin('1234');

    await expect(verifyPin('1234', hash)).resolves.toBe(true);
  });

  it('returns false when the pin does not match the stored hash', async () => {
    const hash = await hashPin('1234');

    await expect(verifyPin('9999', hash)).resolves.toBe(false);
  });

  it('returns false when storedHash is the empty "no PIN set" sentinel, regardless of the pin', async () => {
    await expect(verifyPin('1234', '')).resolves.toBe(false);
    await expect(verifyPin('', '')).resolves.toBe(false);
  });
});
