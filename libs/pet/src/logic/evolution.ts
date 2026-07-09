import type { PetState, EvolutionStage } from '../types';
import { XP_THRESHOLDS } from '../types';

export function computeEvolutionStage(totalXp: number): EvolutionStage {
  if (totalXp >= XP_THRESHOLDS[3]) return 3;
  if (totalXp >= XP_THRESHOLDS[2]) return 2;
  if (totalXp >= XP_THRESHOLDS[1]) return 1;
  return 0;
}

export function addXp(state: PetState, xp: number): PetState {
  const newTotal = state.totalXp + xp;
  const newStage = computeEvolutionStage(newTotal);
  return {
    ...state,
    totalXp: newTotal,
    evolutionStage: newStage,
    happiness:
      newStage > state.evolutionStage
        ? Math.min(100, state.happiness + 30) // burst of happiness on evolution
        : state.happiness,
  };
}

/** XP progress within the current stage (0–1) */
export function getXpProgress(state: PetState): number {
  const stage = state.evolutionStage;
  if (stage === 3) return 1;
  const current = state.totalXp - XP_THRESHOLDS[stage];
  const needed = XP_THRESHOLDS[(stage + 1) as EvolutionStage] - XP_THRESHOLDS[stage];
  return Math.min(1, current / needed);
}
