import { XP_THRESHOLDS, getEvolutionLabel } from '@sierrita/pet';
import type { EvolutionStage } from '@sierrita/pet';

export interface EvolutionStageInfo {
  stage: EvolutionStage;
  label: string;
  xp: number;
  emoji: string;
  color: string;
}

const STAGE_EMOJI: Record<EvolutionStage, string> = {
  0: '🥚',
  1: '🌱',
  2: '🌿',
  3: '🌳',
};
const STAGE_COLOR: Record<EvolutionStage, string> = {
  0: '#B0BEC5',
  1: '#81C784',
  2: '#4CAF50',
  3: '#2E7D32',
};

/** Evolution timeline, derived from the same thresholds/labels the pet engine uses — no duplicated data. */
export const EVOLUTION_STAGES: EvolutionStageInfo[] = (
  [0, 1, 2, 3] as EvolutionStage[]
).map((stage) => ({
  stage,
  label: getEvolutionLabel(stage),
  xp: XP_THRESHOLDS[stage],
  emoji: STAGE_EMOJI[stage],
  color: STAGE_COLOR[stage],
}));
