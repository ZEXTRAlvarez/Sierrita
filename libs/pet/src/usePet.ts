import { useCallback, useEffect, useRef } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { petStateAtom, activeProfileIdAtom } from '../../../apps/mobile/src/store/atoms';
import { getPetState, upsertPetState } from '../../storage/src/petRepository';
import { applyNeedEvent, applySessionDecay, getMood } from './petEngine';
import type { PetNeedEvent, PetMood } from './types';

const SESSION_TICK_MS = 60_000; // 1 minuto

export function usePet() {
  const [petState, setPetState] = useAtom(petStateAtom);
  const activeProfileId = useAtomValue(activeProfileIdAtom);
  const sessionStartRef = useRef<number>(Date.now());
  const lastTickRef = useRef<number>(Date.now());

  // Carga el estado de la mascota desde SQLite cuando cambia el perfil
  useEffect(() => {
    if (!activeProfileId) return;
    getPetState(activeProfileId).then((state) => {
      if (state) {
        setPetState(state);
      }
    });
    sessionStartRef.current = Date.now();
    lastTickRef.current = Date.now();
  }, [activeProfileId, setPetState]);

  // Decay por tiempo de sesión — tick cada minuto mientras la app está activa
  useEffect(() => {
    if (!petState) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedMinutes = (now - lastTickRef.current) / 60_000;
      lastTickRef.current = now;

      setPetState((prev) => {
        if (!prev) return prev;
        const updated = applySessionDecay(prev, elapsedMinutes);
        upsertPetState(updated).catch(console.error);
        return updated;
      });
    }, SESSION_TICK_MS);

    return () => clearInterval(interval);
  }, [!!petState, setPetState]);

  const applyEvent = useCallback(
    (event: PetNeedEvent) => {
      setPetState((prev) => {
        if (!prev) return prev;
        const updated = applyNeedEvent(prev, event);
        upsertPetState(updated).catch(console.error);
        return updated;
      });
    },
    [setPetState],
  );

  const feed = useCallback(() => applyEvent({ type: 'feed', amount: 25 }), [applyEvent]);
  const giveWater = useCallback(() => applyEvent({ type: 'water', amount: 25 }), [applyEvent]);
  const play = useCallback(() => applyEvent({ type: 'play', amount: 20 }), [applyEvent]);
  const rewardXp = useCallback(
    (xp: number) => applyEvent({ type: 'reward', amount: xp }),
    [applyEvent],
  );

  const mood: PetMood = petState ? getMood(petState) : 'neutral';

  return { petState, mood, feed, giveWater, play, rewardXp };
}
