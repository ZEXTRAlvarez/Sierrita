import type * as ExpoCrypto from 'expo-crypto';

/** Hashea un PIN con SHA-256. El resultado es un hex string de 64 caracteres. */
export async function hashPin(pin: string): Promise<string> {
  // Lazy require: keeps expo-crypto's ESM source out of the import graph for
  // callers (barrels, tests) that never actually call hashPin.
  const Crypto: typeof ExpoCrypto = require('expo-crypto');
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pin);
}
