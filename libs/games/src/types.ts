export type World = 'jungle' | 'ocean' | 'space';

export type Difficulty = 1 | 2 | 3;

// Cada juego declara qué parámetros cambian por nivel de dificultad
export interface GameParams {
  difficulty: Difficulty;
  [key: string]: unknown;
}

// Resultado de una ronda dentro de un juego
export interface RoundResult {
  correct: boolean;
  responseTimeMs: number;
  hintsUsed: number;
}

// Estado de sesión de un juego
export interface GameSession {
  gameId: string;
  world: World;
  profileId: string;
  difficulty: Difficulty;
  startedAt: number;
  rounds: RoundResult[];
}

// Resumen al terminar el juego
export interface GameSummary {
  gameId: string;
  world: World;
  totalRounds: number;
  correctRounds: number;
  scorePercent: number; // 0–1
  stars: 1 | 2 | 3;
  xpEarned: number;
  durationSecs: number;
  difficulty: Difficulty;
}

// Config estática de un juego (metadata)
export interface GameConfig {
  id: string;
  world: World;
  titleEs: string;
  emoji: string;
  minAge: 4 | 5 | 6;
  roundCount: number; // cuántas rondas por sesión
  params: (difficulty: Difficulty) => Record<string, unknown>;
}

// Catálogo de IDs de juego por mundo
export const GAME_IDS = {
  jungle: [
    'tracing',
    'words',
    'wordsh',
    'wordsc',
    'sentences',
    'cursive',
  ] as const,
  ocean: [
    'counting',
    'sums',
    'hundreds',
    'compare',
    'casita',
    'sudoku',
  ] as const,
  space: [
    'patterns',
    'memory',
    'classify',
    'maze',
    'oddOneOut',
    'balance',
  ] as const,
} as const;

export type JungleGameId = (typeof GAME_IDS.jungle)[number];
export type OceanGameId = (typeof GAME_IDS.ocean)[number];
export type SpaceGameId = (typeof GAME_IDS.space)[number];
export type GameId = JungleGameId | OceanGameId | SpaceGameId;
