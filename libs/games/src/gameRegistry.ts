import type { GameConfig, Difficulty } from './types';

// ─── Selva — Escritura ────────────────────────────────────────────────────────

const JUNGLE_GAMES: GameConfig[] = [
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

// ─── Océano — Matemáticas ─────────────────────────────────────────────────────

const OCEAN_GAMES: GameConfig[] = [
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
];

// ─── Espacio — Lógica ─────────────────────────────────────────────────────────

const SPACE_GAMES: GameConfig[] = [
  {
    id: 'patterns',
    world: 'space',
    titleEs: 'Secuencias',
    emoji: '🔮',
    minAge: 4,
    roundCount: 5,
    params: (d: Difficulty) => ({
      patternLength: d === 1 ? 3 : d === 2 ? 4 : 5,
      attributes: d === 1 ? ['color'] : d === 2 ? ['color', 'shape'] : ['color', 'shape', 'size'],
      choices: d === 1 ? 2 : d === 2 ? 3 : 4,
    }),
  },
  {
    id: 'memory',
    world: 'space',
    titleEs: 'Memoria Estelar',
    emoji: '🃏',
    minAge: 4,
    roundCount: 1,   // una partida completa = 1 "ronda"
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

// ─── Registro global ──────────────────────────────────────────────────────────

const ALL_GAMES: GameConfig[] = [...JUNGLE_GAMES, ...OCEAN_GAMES, ...SPACE_GAMES];

const REGISTRY = new Map<string, GameConfig>(ALL_GAMES.map((g) => [g.id, g]));

export function getGameConfig(gameId: string): GameConfig {
  const config = REGISTRY.get(gameId);
  if (!config) throw new Error(`Game not found: ${gameId}`);
  return config;
}

export function getWorldGames(world: string): GameConfig[] {
  return ALL_GAMES.filter((g) => g.world === world);
}

export { ALL_GAMES };
