import { computeStars, summarizeSession, speedBonus } from './scoring';
import type { GameSession, RoundResult } from './types';

describe('computeStars', () => {
  it.each([
    [1, 3],
    [0.9, 3],
    [0.89, 2],
    [0.6, 2],
    [0.59, 1],
    [0, 1],
  ])('scorePercent=%f -> %i stars', (scorePercent, expected) => {
    expect(computeStars(scorePercent)).toBe(expected);
  });
});

describe('summarizeSession', () => {
  const round = (correct: boolean): RoundResult => ({ correct, responseTimeMs: 1000, hintsUsed: 0 });

  const session: GameSession = {
    gameId: 'counting',
    world: 'ocean',
    profileId: 'p1',
    difficulty: 2,
    startedAt: Date.now() - 5000,
    rounds: [round(true), round(true), round(false), round(true)],
  };

  it('computes total/correct rounds and score percent', () => {
    const summary = summarizeSession(session);

    expect(summary.totalRounds).toBe(4);
    expect(summary.correctRounds).toBe(3);
    expect(summary.scorePercent).toBe(0.75);
  });

  it('derives stars from the score percent', () => {
    expect(summarizeSession(session).stars).toBe(2);
  });

  it('carries through gameId, world and difficulty unchanged', () => {
    const summary = summarizeSession(session);

    expect(summary.gameId).toBe('counting');
    expect(summary.world).toBe('ocean');
    expect(summary.difficulty).toBe(2);
  });

  it('handles a session with zero rounds without dividing by zero', () => {
    const empty: GameSession = { ...session, rounds: [] };

    const summary = summarizeSession(empty);

    expect(summary.totalRounds).toBe(0);
    expect(summary.scorePercent).toBe(0);
    expect(summary.stars).toBe(1);
  });
});

describe('speedBonus', () => {
  it('returns 0 for an empty round list', () => {
    expect(speedBonus([], 1)).toBe(0);
  });

  it('gives the top bonus for very fast average responses', () => {
    const rounds: RoundResult[] = [{ correct: true, responseTimeMs: 1000, hintsUsed: 0 }];
    // difficulty 1 threshold is 8000ms; 1000 < 8000 * 0.5
    expect(speedBonus(rounds, 1)).toBe(10);
  });

  it('gives the mid bonus for moderately fast responses', () => {
    const rounds: RoundResult[] = [{ correct: true, responseTimeMs: 5000, hintsUsed: 0 }];
    // 5000 is between 8000*0.5=4000 and 8000*0.75=6000
    expect(speedBonus(rounds, 1)).toBe(5);
  });

  it('gives no bonus for slow responses', () => {
    const rounds: RoundResult[] = [{ correct: true, responseTimeMs: 8000, hintsUsed: 0 }];
    expect(speedBonus(rounds, 1)).toBe(0);
  });

  it('scales the threshold down for higher difficulty', () => {
    const rounds: RoundResult[] = [{ correct: true, responseTimeMs: 1900, hintsUsed: 0 }];
    // difficulty 3 threshold is 4000ms; 1900 < 4000*0.5=2000 -> top bonus
    expect(speedBonus(rounds, 3)).toBe(10);
  });
});
