import type { Difficulty } from '../../games/src/types';

export interface DifficultyState {
  profileId: string;
  gameId: string;
  currentLevel: Difficulty;
  consecutiveHits: number;
  consecutiveMiss: number;
  totalAttempts: number;
  totalCorrect: number;
  updatedAt: number;
}

// Umbrales para subir/bajar de nivel
export const ADAPTIVE_CONFIG = {
  hitsToLevelUp:   3,   // aciertos consecutivos para subir
  missToLevelDown: 2,   // fallos consecutivos para bajar
} as const;
