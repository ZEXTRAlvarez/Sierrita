import type {
  RoundResult,
  GameSummary,
  GameSession,
  Difficulty,
} from './types';
import { computeGameXp } from '@sierrita/pet';

export function computeStars(scorePercent: number): 1 | 2 | 3 {
  if (scorePercent >= 0.9) return 3;
  if (scorePercent >= 0.6) return 2;
  return 1;
}

export function summarizeSession(session: GameSession): GameSummary {
  const { rounds } = session;
  const totalRounds = rounds.length;
  const correctRounds = rounds.filter((r) => r.correct).length;
  const scorePercent = totalRounds > 0 ? correctRounds / totalRounds : 0;
  const stars = computeStars(scorePercent);
  const durationSecs = Math.round((Date.now() - session.startedAt) / 1000);
  const xpEarned = computeGameXp(session.difficulty, scorePercent);

  return {
    gameId: session.gameId,
    world: session.world,
    totalRounds,
    correctRounds,
    scorePercent,
    stars,
    xpEarned,
    durationSecs,
    difficulty: session.difficulty,
  };
}

// XP bonus por tiempo rápido (si el niño responde rápido en promedio)
export function speedBonus(
  rounds: RoundResult[],
  difficulty: Difficulty,
): number {
  if (rounds.length === 0) return 0;
  const avgMs =
    rounds.reduce((s, r) => s + r.responseTimeMs, 0) / rounds.length;
  const threshold = difficulty === 1 ? 8000 : difficulty === 2 ? 6000 : 4000;
  if (avgMs < threshold * 0.5) return 10;
  if (avgMs < threshold * 0.75) return 5;
  return 0;
}
