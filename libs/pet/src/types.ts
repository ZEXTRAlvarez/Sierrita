import type { PetType } from '@sierrita/profiles';

export type { PetType };

export type EvolutionStage = 0 | 1 | 2 | 3;

export interface PetState {
  profileId: string;
  petType: PetType;
  petName: string | null;
  hunger: number; // 0–100: 0 = starving, 100 = full
  thirst: number; // 0–100
  happiness: number; // 0–100
  evolutionStage: EvolutionStage;
  outfitId: string | null;
  totalXp: number;
  lastSessionAt: number;
}

export type PetMood = 'happy' | 'neutral' | 'hungry' | 'thirsty' | 'sad';

export interface PetNeedEvent {
  type: 'feed' | 'water' | 'play' | 'reward';
  amount: number;
}

// XP thresholds for each evolution stage
export const XP_THRESHOLDS: Record<EvolutionStage, number> = {
  0: 0,
  1: 150,
  2: 500,
  3: 1200,
};

// How fast needs decay per minute of session time
export const DECAY_RATES = {
  hungerPerMinute: 3,
  thirstPerMinute: 4,
  happinessPerMinute: 2,
} as const;
