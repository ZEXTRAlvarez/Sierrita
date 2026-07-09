import { createInitialPetState } from './petStateFactory';

describe('createInitialPetState', () => {
  it('creates a fresh pet with mid-range needs and no XP', () => {
    const state = createInitialPetState('profile-1', 'dragon');

    expect(state.profileId).toBe('profile-1');
    expect(state.petType).toBe('dragon');
    expect(state.petName).toBeNull();
    expect(state.hunger).toBe(80);
    expect(state.thirst).toBe(80);
    expect(state.happiness).toBe(80);
    expect(state.evolutionStage).toBe(0);
    expect(state.outfitId).toBeNull();
    expect(state.totalXp).toBe(0);
  });

  it('stamps lastSessionAt as a unix-seconds timestamp', () => {
    const before = Math.floor(Date.now() / 1000);
    const state = createInitialPetState('profile-1', 'cat');
    const after = Math.floor(Date.now() / 1000);

    expect(state.lastSessionAt).toBeGreaterThanOrEqual(before);
    expect(state.lastSessionAt).toBeLessThanOrEqual(after);
  });
});
