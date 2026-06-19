import { useCallback, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { activeProfileIdAtom } from '../store/atoms';
import { getGameConfig, summarizeSession, speedBonus } from '../../../../libs/games/src';
import { saveGameSession } from '../../../../libs/storage/src/gameSessionRepository';
import { processRoundResult, createInitialDifficultyState } from '../../../../libs/adaptive/src/adaptiveEngine';
import { getDifficultyState, upsertDifficultyState } from '../../../../libs/storage/src/difficultyRepository';
import {
  speak, hapticSuccess, hapticError,
  FEEDBACK_CORRECT, FEEDBACK_WRONG, FEEDBACK_LEVELUP, randomFrom,
} from '../../../../libs/audio/src/audioManager';
import type { GameSession, GameSummary, RoundResult } from '../../../../libs/games/src/types';
import type { DifficultyState } from '../../../../libs/adaptive/src/types';

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
  const [session, setSession]             = useState<GameSession | null>(null);
  const [diffState, setDiffState]         = useState<DifficultyState | null>(null);
  const [summary, setSummary]             = useState<GameSummary | null>(null);
  const [isFinished, setIsFinished]       = useState(false);
  const diffStateRef                      = useRef<DifficultyState | null>(null);
  const sessionRef                        = useRef<GameSession | null>(null);

  const startSession = useCallback(async (gameId: string, world: string) => {
    if (!profileId) return;

    const config = getGameConfig(gameId);

    // Carga o crea el estado de dificultad para este juego/perfil
    let ds = await getDifficultyState(profileId, gameId);
    if (!ds) {
      ds = createInitialDifficultyState(profileId, gameId);
      await upsertDifficultyState(ds);
    }
    diffStateRef.current = ds;
    setDiffState(ds);
    setSummary(null);
    setIsFinished(false);

    const newSession: GameSession = {
      gameId,
      world: world as GameSession['world'],
      profileId,
      difficulty: ds.currentLevel,
      startedAt: Date.now(),
      rounds: [],
    };
    sessionRef.current = newSession;
    setSession(newSession);

    // Instrucción por voz al iniciar
    const instructions = [
      `¡Vamos a jugar ${config.titleEs}!`,
    ];
    speak(instructions[0]);
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

    // Feedback inmediato — háptico + voz
    if (correct) {
      await hapticSuccess();
      speak(randomFrom(FEEDBACK_CORRECT));
    } else {
      await hapticError();
      speak(randomFrom(FEEDBACK_WRONG));
    }

    // Actualiza dificultad adaptativa
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
    const bonus   = speedBonus(currentSession.rounds, currentSession.difficulty);
    const final   = { ...gameSummary, xpEarned: gameSummary.xpEarned + bonus };

    await saveGameSession(profileId, final);
    setSummary(final);
    setIsFinished(true);

    // Frase de cierre
    const closing =
      final.stars === 3 ? '¡Tres estrellas! ¡Sos una estrella!' :
      final.stars === 2 ? '¡Muy bien! ¡Dos estrellas!' :
                          '¡Lo intentaste muy bien!';
    speak(closing);

    return final;
  }, [profileId]);

  return {
    session,
    difficultyState: diffState,
    summary,
    isFinished,
    startSession,
    recordRound,
    finishSession,
  };
}
