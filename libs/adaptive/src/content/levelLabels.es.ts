import type { Difficulty } from '@sierrita/games';

const LEVEL_LABELS: Record<Difficulty, string> = {
  1: '⭐ Fácil',
  2: '⭐⭐ Normal',
  3: '⭐⭐⭐ Difícil',
};

/** Descripción de nivel para mostrar al niño (con emoji) */
export function levelLabel(level: Difficulty): string {
  return LEVEL_LABELS[level];
}
