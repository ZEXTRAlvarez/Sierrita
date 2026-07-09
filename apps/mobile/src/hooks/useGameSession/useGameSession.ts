import { useCallback, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { activeProfileIdAtom } from '../../store/atoms';
import { getGameConfig, summarizeSession, speedBonus, FEEDBACK_LEVELUP, randomFrom } from '@sierrita/games';
import { saveGameSession, upsertDifficultyState } from '@sierrita/storage';
import { processRoundResult } from '@sierrita/adaptive';
import { speak } from '@sierrita/audio';
import type { GameSession, GameSummary, RoundResult } from '@sierrita/games';
import type { DifficultyState } from '@sierrita/adaptive';
import { buildSession } from './logic/buildSession';
import { closingMessage } from './logic/closingMessage';
import { playRoundFeedback } from './logic/playRoundFeedback';
import { loadOrCreateDifficultyState } from './logic/loadOrCreateDifficultyState';

interface UseGameSessionReturn {
  session: GameSession | null;
  difficultyState: DifficultyState | null;
  summary: GameSummary | null;
  isFinished: boolean;
  startSession: (gameId: string, world: string) => Promise<void>;
  recordRound: (correct: boolean, responseTimeMs: number, hintsUsed?: number) => Promise<{ levelChanged: boolean; levelUp: boolean }>;
  finishSession: () => Promise<GameSummary>;
}

export function useGameSession(): UseGameSessionReturn {
  const profileId = useAtomValue(activeProfileIdAtom);
  const [session, setSession] = useState<GameSession | null>(null);
  const [diffState, setDiffState] = useState<DifficultyState | null>(null);
  const [summary, setSummary] = useState<GameSummary | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const diffStateRef = useRef<DifficultyState | null>(null);
  const sessionRef = useRef<GameSession | null>(null);

  const startSession = useCallback(async (gameId: string, world: string) => {
    if (!profileId) return;
    const config = getGameConfig(gameId);

    const ds = await loadOrCreateDifficultyState(profileId, gameId);
    diffStateRef.current = ds;
    setDiffState(ds);
    setSummary(null);
    setIsFinished(false);

    const newSession = buildSession(gameId, world, profileId, ds.currentLevel);
    sessionRef.current = newSession;
    setSession(newSession);

    speak(`¡Vamos a jugar ${config.titleEs}!`);
  }, [profileId]);

  const recordRound = useCallback(async (
    correct: boolean,
    responseTimeMs: number,
    hintsUsed = 0,
  ): Promise<{ levelChanged: boolean; levelUp: boolean }> => {
    if (!diffStateRef.current) return { levelChanged: false, levelUp: false };

    const round: RoundResult = { correct, responseTimeMs, hintsUsed };
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, rounds: [...prev.rounds, round] };
      sessionRef.current = next;
      return next;
    });

    await playRoundFeedback(correct);

    const { next, levelChanged, levelUp } = processRoundResult(diffStateRef.current, correct);
    diffStateRef.current = next;
    setDiffState(next);
    await upsertDifficultyState(next);

    if (levelChanged && levelUp) {
      setTimeout(() => speak(randomFrom(FEEDBACK_LEVELUP)), 1500);
    }

    return { levelChanged, levelUp };
  }, []);

  const finishSession = useCallback(async (): Promise<GameSummary> => {
    const currentSession = sessionRef.current;
    if (!currentSession || !profileId) throw new Error('No active session');

    const gameSummary = summarizeSession(currentSession);
    const bonus = speedBonus(currentSession.rounds, currentSession.difficulty);
    const final = { ...gameSummary, xpEarned: gameSummary.xpEarned + bonus };

    await saveGameSession(profileId, final);
    setSummary(final);
    setIsFinished(true);
    speak(closingMessage(final.stars));

    return final;
  }, [profileId]);

  return { session, difficultyState: diffState, summary, isFinished, startSession, recordRound, finishSession };
}
