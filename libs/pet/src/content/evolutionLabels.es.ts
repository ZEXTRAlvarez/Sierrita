import type { EvolutionStage } from '../types';

const EVOLUTION_LABELS: Record<EvolutionStage, string> = {
  0: 'Bebé',
  1: 'Niño',
  2: 'Joven',
  3: 'Adulto',
};

export function getEvolutionLabel(stage: EvolutionStage): string {
  return EVOLUTION_LABELS[stage];
}
