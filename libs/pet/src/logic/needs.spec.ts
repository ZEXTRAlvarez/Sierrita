import { applyNeedEvent } from './needs';
import { createInitialPetState } from './petStateFactory';

describe('applyNeedEvent', () => {
  it('feed increases hunger and a fraction of happiness', () => {
    const state = createInitialPetState('p1', 'dragon');

    const result = applyNeedEvent(state, { type: 'feed', amount: 10 });

    expect(result.hunger).toBe(90);
    expect(result.happiness).toBe(80 + Math.floor(10 * 0.2));
  });

  it('water increases thirst and a fraction of happiness', () => {
    const state = createInitialPetState('p1', 'dragon');

    const result = applyNeedEvent(state, { type: 'water', amount: 10 });

    expect(result.thirst).toBe(90);
    expect(result.happiness).toBe(80 + Math.floor(10 * 0.15));
  });

  it('play increases happiness but costs hunger and thirst', () => {
    const state = createInitialPetState('p1', 'dragon');

    const result = applyNeedEvent(state, { type: 'play', amount: 10 });

    expect(result.happiness).toBe(90);
    expect(result.hunger).toBe(80 - Math.floor(10 * 0.1));
    expect(result.thirst).toBe(80 - Math.floor(10 * 0.15));
  });

  it('reward grants XP via addXp instead of touching needs', () => {
    const state = createInitialPetState('p1', 'dragon');

    const result = applyNeedEvent(state, { type: 'reward', amount: 50 });

    expect(result.totalXp).toBe(50);
    expect(result.hunger).toBe(state.hunger);
    expect(result.thirst).toBe(state.thirst);
  });

  it('clamps values at 100 even when an event would overflow', () => {
    const state = { ...createInitialPetState('p1', 'dragon'), hunger: 95 };

    const result = applyNeedEvent(state, { type: 'feed', amount: 50 });

    expect(result.hunger).toBe(100);
  });

  it('returns the state unchanged for an unknown event type', () => {
    const state = createInitialPetState('p1', 'dragon');

    // @ts-expect-error — intentionally exercising the default branch with an invalid type
    const result = applyNeedEvent(state, { type: 'unknown', amount: 10 });

    expect(result).toEqual(state);
  });
});
