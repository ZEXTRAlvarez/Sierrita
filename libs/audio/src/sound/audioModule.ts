import type * as ExpoAv from 'expo-av';

type ExpoAudioModule = typeof ExpoAv.Audio;

// expo-av requires a native module — guard against it being unavailable in
// Expo Go / dev environments, and allow tests to inject a fake.
let cachedModule: ExpoAudioModule | null | undefined;

export function getAudioModule(): ExpoAudioModule | null {
  if (cachedModule === undefined) {
    try {
      const mod: typeof ExpoAv = require('expo-av');
      cachedModule = mod.Audio;
    } catch {
      cachedModule = null;
    }
  }
  return cachedModule;
}

/** Test-only seam to inject a fake audio module (or force the unavailable case with null). */
export function __setAudioModuleForTesting(mod: ExpoAudioModule | null | undefined): void {
  cachedModule = mod;
}
