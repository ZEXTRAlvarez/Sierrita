import { atom } from 'jotai';
import type { Profile, PetType } from '@sierrita/profiles';
import type { PetState, PetMood } from '@sierrita/pet';
import type { World } from '@sierrita/parents';

export type { Profile, PetType, PetState, PetMood, World };

// ─── Profiles ─────────────────────────────────────────────────────────────────
export const profilesAtom      = atom<Profile[]>([]);
export const activeProfileIdAtom = atom<string | null>(null);
export const activeProfileAtom = atom<Profile | null>((get) => {
  const id = get(activeProfileIdAtom);
  return get(profilesAtom).find((p) => p.id === id) ?? null;
});

// ─── Pet ──────────────────────────────────────────────────────────────────────
export const petStateAtom = atom<PetState | null>(null);

export const petMoodAtom = atom<PetMood>((get) => {
  const pet = get(petStateAtom);
  if (!pet) return 'neutral';
  if (pet.hunger < 25)    return 'hungry';
  if (pet.thirst < 25)    return 'thirsty';
  if (pet.happiness < 35) return 'sad';
  if (pet.happiness > 75 && pet.hunger > 60 && pet.thirst > 60) return 'happy';
  return 'neutral';
});

// ─── Game / World ─────────────────────────────────────────────────────────────
export const activeWorldAtom  = atom<World | null>(null);
export const activeGameIdAtom = atom<string | null>(null);
export const difficultyMapAtom = atom<Record<string, {
  currentLevel: 1 | 2 | 3;
  consecutiveHits: number;
  consecutiveMiss: number;
}>>({});

// ─── Session ──────────────────────────────────────────────────────────────────
export const sessionStartAtom = atom<number | null>(null);
export const sessionScoreAtom = atom<number>(0);

// ─── App settings ─────────────────────────────────────────────────────────────
export const appSettingsAtom = atom({
  soundEnabled: true,
  musicEnabled: true,
  voiceEnabled: true,
});

// ─── UI ───────────────────────────────────────────────────────────────────────
export const isParentModeAtom = atom<boolean>(false);
export const appReadyAtom     = atom<boolean>(false);
