import type { GameConfig, Difficulty } from '../types';

// ─── Océano — Matemáticas ─────────────────────────────────────────────────────

export const OCEAN_GAMES: GameConfig[] = [
  {
    id: 'counting',
    world: 'ocean',
    titleEs: 'Contar Pececitos',
    emoji: '🐟',
    minAge: 4,
    roundCount: 6,
    params: (d: Difficulty) => ({
      maxNumber: d === 1 ? 10 : d === 2 ? 50 : 99,
      visualObjects: true,
    }),
  },
  {
    id: 'sums',
    world: 'ocean',
    titleEs: 'Sumas y Restas',
    emoji: '➕',
    minAge: 5,
    roundCount: 6,
    params: (d: Difficulty) => ({
      maxOperand: d === 1 ? 10 : d === 2 ? 20 : 50,
      operations: d === 1 ? ['add'] : d === 2 ? ['add', 'sub'] : ['add', 'sub'],
      resultMax: d === 1 ? 10 : d === 2 ? 30 : 99,
    }),
  },
  {
    id: 'hundreds',
    world: 'ocean',
    titleEs: 'Centenas y Decenas',
    emoji: '💯',
    minAge: 6,
    roundCount: 5,
    params: (d: Difficulty) => ({
      maxNumber: d === 1 ? 99 : d === 2 ? 199 : 299,
      mode: d === 1 ? 'identify' : d === 2 ? 'decompose' : 'compose',
    }),
  },
  {
    id: 'compare',
    world: 'ocean',
    titleEs: 'Mayor y Menor',
    emoji: '⚖️',
    minAge: 4,
    roundCount: 6,
    params: (d: Difficulty) => ({
      maxNumber: d === 1 ? 20 : d === 2 ? 100 : 299,
      mode: d === 1 ? 'visual' : d === 2 ? 'number' : 'expression',
    }),
  },
  {
    id: 'casita',
    world: 'ocean',
    titleEs: 'La Casita',
    emoji: '🏠',
    minAge: 6,
    roundCount: 5,
    params: (d: Difficulty) => ({
      // Decenas y unidades solamente en el nivel 1 (recién arrancando);
      // centenas se suman a partir del nivel 2.
      useHundreds: d >= 2,
      maxOperand: d === 1 ? 39 : d === 2 ? 399 : 899,
      operations: d === 1 ? ['add'] : ['add', 'sub'],
      resultMax: d === 1 ? 99 : 999,
      // Higher difficulty forces the carry/borrow case more often.
      regroupChance: d === 1 ? 0.4 : d === 2 ? 0.65 : 0.9,
    }),
  },
  {
    id: 'sudoku',
    world: 'ocean',
    titleEs: 'Sudoku',
    emoji: '🔢',
    minAge: 6,
    roundCount: 5,
    params: (d: Difficulty) => ({
      // La dificultad escala el tamaño de la grilla, no la cantidad de
      // casillas a completar (siempre roundCount blancos).
      gridSize: d === 1 ? 4 : d === 2 ? 6 : 9,
      boxRows: d === 1 ? 2 : d === 2 ? 2 : 3,
      boxCols: d === 1 ? 2 : d === 2 ? 3 : 3,
    }),
  },
];
