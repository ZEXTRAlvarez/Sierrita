import { applySessionDecay } from './decay';
import { createInitialPetState } from './petStateFactory';

describe('applySessionDecay', () => {
  it('reduces hunger, thirst and happiness proportionally to elapsed minutes', () => {
    const state = createInitialPetState('p1', 'dragon');

    const result = applySessionDecay(state, 5);

    expect(result.hunger).toBe(80 - 3 * 5);
    expect(result.thirst).toBe(80 - 4 * 5);
    expect(result.happiness).toBe(80 - 2 * 5);
  });

  it('clamps hunger/thirst/happiness at the 0 floor for long sessions', () => {
    const state = createInitialPetState('p1', 'dragon');

    const result = applySessionDecay(state, 1000);

    expect(result.hunger).toBe(0);
    expect(result.thirst).toBe(0);
    expect(result.happiness).toBe(0);
  });

  it('is a no-op for zero elapsed minutes', () => {
    const state = createInitialPetState('p1', 'dragon');

    const result = applySessionDecay(state, 0);

    expect(result.hunger).toBe(state.hunger);
    expect(result.thirst).toBe(state.thirst);
    expect(result.happiness).toBe(state.happiness);
  });
});
