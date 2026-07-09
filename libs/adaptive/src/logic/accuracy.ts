import type { DifficultyState } from '../types';

/** Porcentaje de aciertos histórico para mostrar en estadísticas */
export function accuracyPercent(state: DifficultyState): number {
  if (state.totalAttempts === 0) return 0;
  return state.totalCorrect / state.totalAttempts;
}
