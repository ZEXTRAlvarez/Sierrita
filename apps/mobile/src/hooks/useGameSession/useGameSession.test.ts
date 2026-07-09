import { renderHook, act } from '@testing-library/react-native';
import { useGameSession } from './useGameSession';

jest.mock('jotai', () => ({ useAtomValue: () => 'p1' }));
jest.mock('../../store/atoms', () => ({ activeProfileIdAtom: 'activeProfileId' }));
jest.mock('@sierrita/games', () => ({
  getGameConfig: jest.fn(() => ({ titleEs: 'Trazos y Letras', roundCount: 3 })),
  summarizeSession: jest.fn((session) => ({
    gameId: session.gameId,
    world: session.world,
    totalRounds: session.rounds.length,
    correctRounds: session.rounds.filter((r: any) => r.correct).length,
    scorePercent: 1,
    stars: 3,
    xpEarned: 30,
    durationSecs: 10,
    difficulty: session.difficulty,
  })),
  speedBonus: jest.fn(() => 5),
  FEEDBACK_LEVELUP: ['¡Subiste de nivel!'],
  randomFrom: (arr: string[]) => arr[0],
}));
jest.mock('@sierrita/storage', () => ({
  saveGameSession: jest.fn(async () => undefined),
  upsertDifficultyState: jest.fn(async () => undefined),
}));
jest.mock('@sierrita/adaptive', () => ({
  processRoundResult: jest.fn((ds) => ({ next: ds, levelChanged: false, levelUp: false })),
}));
jest.mock('./logic/loadOrCreateDifficultyState', () => ({
  loadOrCreateDifficultyState: jest.fn(async (profileId: string, gameId: string) => ({ profileId, gameId, currentLevel: 1 })),
}));
jest.mock('./logic/playRoundFeedback', () => ({ playRoundFeedback: jest.fn(async () => undefined) }));

describe('useGameSession', () => {
  it('starts a session with an empty round list', async () => {
    const { result } = renderHook(() => useGameSession());

    await act(async () => {
      await result.current.startSession('tracing', 'jungle');
    });

    expect(result.current.session).toMatchObject({ gameId: 'tracing', world: 'jungle', rounds: [] });
    expect(result.current.difficultyState).toMatchObject({ currentLevel: 1 });
  });

  it('appends a round to the session on recordRound', async () => {
    const { result } = renderHook(() => useGameSession());
    await act(async () => {
      await result.current.startSession('tracing', 'jungle');
    });

    await act(async () => {
      await result.current.recordRound(true, 1200);
    });

    expect(result.current.session?.rounds).toEqual([{ correct: true, responseTimeMs: 1200, hintsUsed: 0 }]);
  });

  it('finishes the session with a bonus-adjusted xp total', async () => {
    const { result } = renderHook(() => useGameSession());
    await act(async () => {
      await result.current.startSession('tracing', 'jungle');
    });
    await act(async () => {
      await result.current.recordRound(true, 1200);
    });

    let finalSummary;
    await act(async () => {
      finalSummary = await result.current.finishSession();
    });

    expect(finalSummary).toMatchObject({ xpEarned: 35 });
    expect(result.current.isFinished).toBe(true);
  });
});
