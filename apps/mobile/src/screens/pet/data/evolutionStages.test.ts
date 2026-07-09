import { EVOLUTION_STAGES, type EvolutionStageInfo } from './evolutionStages';

describe('EVOLUTION_STAGES', () => {
  it('has one entry per evolution stage, in order', () => {
    expect(EVOLUTION_STAGES.map((s: EvolutionStageInfo) => s.stage)).toEqual([
      0, 1, 2, 3,
    ]);
  });

  it('derives xp thresholds and labels from @sierrita/pet (no hardcoded duplication)', () => {
    expect(EVOLUTION_STAGES[0]).toMatchObject({ xp: 0, label: 'Bebé' });
    expect(EVOLUTION_STAGES[1]).toMatchObject({ xp: 150, label: 'Niño' });
    expect(EVOLUTION_STAGES[2]).toMatchObject({ xp: 500, label: 'Joven' });
    expect(EVOLUTION_STAGES[3]).toMatchObject({ xp: 1200, label: 'Adulto' });
  });
});
