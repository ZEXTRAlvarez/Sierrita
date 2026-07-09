import type { GameSession } from '@sierrita/games';

export function buildSession(
  gameId: string,
  world: string,
  profileId: string,
  difficulty: GameSession['difficulty'],
): GameSession {
  return {
    gameId,
    world: world as GameSession['world'],
    profileId,
    difficulty,
    startedAt: Date.now(),
    rounds: [],
  };
}
