import type { GameConfig } from '../types';
import { JUNGLE_GAMES } from './jungleGames';
import { OCEAN_GAMES } from './oceanGames';
import { SPACE_GAMES } from './spaceGames';

export const ALL_GAMES: GameConfig[] = [...JUNGLE_GAMES, ...OCEAN_GAMES, ...SPACE_GAMES];

const REGISTRY = new Map<string, GameConfig>(ALL_GAMES.map((g) => [g.id, g]));

export function getGameConfig(gameId: string): GameConfig {
  const config = REGISTRY.get(gameId);
  if (!config) throw new Error(`Game not found: ${gameId}`);
  return config;
}

export function getWorldGames(world: string): GameConfig[] {
  return ALL_GAMES.filter((g) => g.world === world);
}
