import type { GameConfig, Difficulty } from '../types';

// ─── Espacio — Lógica ─────────────────────────────────────────────────────────

export const SPACE_GAMES: GameConfig[] = [
  {
    id: 'patterns',
    world: 'space',
    titleEs: 'Secuencias',
    emoji: '🔮',
    minAge: 4,
    roundCount: 5,
    params: (d: Difficulty) => ({
      patternLength: d === 1 ? 3 : d === 2 ? 4 : 5,
      attributes:
        d === 1
          ? ['color']
          : d === 2
            ? ['color', 'shape']
            : ['color', 'shape', 'size'],
      choices: d === 1 ? 2 : d === 2 ? 3 : 4,
    }),
  },
  {
    id: 'memory',
    world: 'space',
    titleEs: 'Memoria Estelar',
    emoji: '🃏',
    minAge: 4,
    roundCount: 1, // una partida completa = 1 "ronda"
    params: (d: Difficulty) => ({
      pairs: d === 1 ? 4 : d === 2 ? 6 : 8,
      flipDelay: d === 1 ? 1200 : d === 2 ? 900 : 700,
    }),
  },
  {
    id: 'classify',
    world: 'space',
    titleEs: 'Clasificar Objetos',
    emoji: '📦',
    minAge: 4,
    roundCount: 5,
    params: (d: Difficulty) => ({
      categories: d === 1 ? 2 : d === 2 ? 3 : 4,
      attribute: d === 1 ? 'color' : d === 2 ? 'shape' : 'size',
      itemCount: d === 1 ? 6 : d === 2 ? 8 : 10,
    }),
  },
  {
    id: 'maze',
    world: 'space',
    titleEs: 'Laberinto Estelar',
    emoji: '🌀',
    minAge: 5,
    roundCount: 1,
    params: (d: Difficulty) => ({
      gridSize: d === 1 ? 5 : d === 2 ? 7 : 9,
      walls: d === 1 ? 'sparse' : d === 2 ? 'medium' : 'dense',
    }),
  },
];
