import type { GameConfig, Difficulty } from '../types';

// ─── Laboratorio Curioso — Ciencias Naturales ──────────────────────────────

export const SCIENCE_GAMES: GameConfig[] = [
  {
    id: 'humanBody',
    world: 'science',
    titleEs: 'El Cuerpo Humano',
    emoji: '🫀',
    minAge: 7,
    roundCount: 6,
    params: (d: Difficulty) => ({
      // Partes externas (nivel 1) → + órganos internos básicos (nivel 2) →
      // + órganos internos menos conocidos (nivel 3).
      tiers: d === 1 ? [1] : d === 2 ? [1, 2] : [1, 2, 3],
    }),
  },
];
