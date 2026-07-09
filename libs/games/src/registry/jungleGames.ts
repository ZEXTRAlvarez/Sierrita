import type { GameConfig, Difficulty } from '../types';

// ─── Selva — Escritura ────────────────────────────────────────────────────────

export const JUNGLE_GAMES: GameConfig[] = [
  {
    id: 'tracing',
    world: 'jungle',
    titleEs: 'Trazos y Letras',
    emoji: '✏️',
    minAge: 4,
    roundCount: 6,
    params: (d: Difficulty) => ({
      letterSet: d === 1 ? 'vowels' : d === 2 ? 'consonants-easy' : 'all',
      showGuide: d === 1,
      guideOpacity: d === 1 ? 0.6 : d === 2 ? 0.3 : 0,
    }),
  },
  {
    id: 'words',
    world: 'jungle',
    titleEs: 'Palabras Mágicas',
    emoji: '🔤',
    minAge: 5,
    roundCount: 5,
    params: (d: Difficulty) => ({
      wordLength: d === 1 ? 3 : d === 2 ? 4 : 5,
      blanks: d === 1 ? 1 : d === 2 ? 2 : 3,
      category: d === 1 ? 'animals' : d === 2 ? 'objects' : 'mixed',
    }),
  },
  {
    id: 'sentences',
    world: 'jungle',
    titleEs: 'Armar Oraciones',
    emoji: '📝',
    minAge: 6,
    roundCount: 4,
    params: (d: Difficulty) => ({
      wordCount: d === 1 ? 3 : d === 2 ? 4 : 5,
      shuffleIntensity: d,
    }),
  },
  {
    id: 'cursive',
    world: 'jungle',
    titleEs: 'Letra Cursiva',
    emoji: '🖊️',
    minAge: 6,
    roundCount: 5,
    params: (d: Difficulty) => ({
      letterSet: d === 1 ? 'vowels' : d === 2 ? 'lowercase' : 'uppercase',
      showGuide: d === 1,
    }),
  },
];
