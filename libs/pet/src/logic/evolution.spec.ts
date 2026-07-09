import { addXp, computeEvolutionStage, getXpProgress } from './evolution';
import { createInitialPetState } from './petStateFactory';

describe('computeEvolutionStage', () => {
  it.each([
    [0, 0],
    [149, 0],
    [150, 1],
    [499, 1],
    [500, 2],
    [1199, 2],
    [1200, 3],
    [5000, 3],
  ])('maps totalXp=%i to stage %i', (totalXp, expected) => {
    expect(computeEvolutionStage(totalXp)).toBe(expected);
  });
});

describe('addXp', () => {
  it('accumulates XP onto the existing total', () => {
    const state = { ...createInitialPetState('p1', 'dragon'), totalXp: 100 };

    const result = addXp(state, 20);

    expect(result.totalXp).toBe(120);
  });

  it('advances the evolution stage when a threshold is crossed', () => {
    const state = { ...createInitialPetState('p1', 'dragon'), totalXp: 140 };

    const result = addXp(state, 20);

    expect(result.evolutionStage).toBe(1);
  });

  it('gives a happiness burst (capped at 100) on evolution', () => {
    const state = { ...createInitialPetState('p1', 'dragon'), totalXp: 140, happiness: 80 };

    const result = addXp(state, 20);

    expect(result.happiness).toBe(100);
  });

  it('does not change happiness when the stage does not advance', () => {
    const state = { ...createInitialPetState('p1', 'dragon'), totalXp: 0, happiness: 80 };

    const result = addXp(state, 10);

    expect(result.happiness).toBe(80);
  });
});

describe('getXpProgress', () => {
  it('returns 0 at the start of a stage', () => {
    const state = { ...createInitialPetState('p1', 'dragon'), totalXp: 150, evolutionStage: 1 as const };

    expect(getXpProgress(state)).toBe(0);
  });

  it('returns a fraction mid-stage', () => {
    // stage 1 spans 150 -> 500 (range 350); at 325 that's 175/350 = 0.5
    const state = { ...createInitialPetState('p1', 'dragon'), totalXp: 325, evolutionStage: 1 as const };

    expect(getXpProgress(state)).toBeCloseTo(0.5);
  });

  it('returns 1 once the max stage is reached, regardless of XP', () => {
    const state = { ...createInitialPetState('p1', 'dragon'), totalXp: 999999, evolutionStage: 3 as const };

    expect(getXpProgress(state)).toBe(1);
  });
});
