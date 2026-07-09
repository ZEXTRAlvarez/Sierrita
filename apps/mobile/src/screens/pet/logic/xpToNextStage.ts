import { XP_THRESHOLDS } from '@sierrita/pet';
import type { EvolutionStage } from '@sierrita/pet';

/** XP still needed to reach the next evolution stage; 0 once at the max stage. */
export function xpToNextStage(evolutionStage: EvolutionStage, totalXp: number): number {
  if (evolutionStage >= 3) return 0;
  return XP_THRESHOLDS[(evolutionStage + 1) as EvolutionStage] - totalXp;
}
