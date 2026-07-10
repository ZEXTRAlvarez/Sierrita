import type * as ExpoAudio from 'expo-audio';

type AudioModuleApi = Pick<
  typeof ExpoAudio,
  'createAudioPlayer' | 'setAudioModeAsync'
>;

// expo-audio requires a native module — guard against it being unavailable in
// Expo Go / dev environments, and allow tests to inject a fake.
let cachedModule: AudioModuleApi | null | undefined;

export function getAudioModule(): AudioModuleApi | null {
  if (cachedModule === undefined) {
    try {
      const mod: typeof ExpoAudio = require('expo-audio');
      cachedModule = {
        createAudioPlayer: mod.createAudioPlayer,
        setAudioModeAsync: mod.setAudioModeAsync,
      };
    } catch {
      cachedModule = null;
    }
  }
  return cachedModule;
}

/** Test-only seam to inject a fake audio module (or force the unavailable case with null). */
export function __setAudioModuleForTesting(
  mod: AudioModuleApi | null | undefined,
): void {
  cachedModule = mod;
}
