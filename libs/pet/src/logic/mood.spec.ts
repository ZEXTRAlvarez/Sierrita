import { getMood } from './mood';
import { createInitialPetState } from './petStateFactory';

const base = () => createInitialPetState('p1', 'dragon');

describe('getMood', () => {
  it('is hungry when hunger drops below 25, taking priority over other needs', () => {
    const state = { ...base(), hunger: 10, thirst: 10, happiness: 10 };

    expect(getMood(state)).toBe('hungry');
  });

  it('is thirsty when thirst drops below 25 and hunger is fine', () => {
    const state = { ...base(), hunger: 50, thirst: 10, happiness: 10 };

    expect(getMood(state)).toBe('thirsty');
  });

  it('is sad when happiness drops below 35 and hunger/thirst are fine', () => {
    const state = { ...base(), hunger: 50, thirst: 50, happiness: 20 };

    expect(getMood(state)).toBe('sad');
  });

  it('is happy when happiness, hunger and thirst are all comfortably high', () => {
    const state = { ...base(), hunger: 80, thirst: 80, happiness: 80 };

    expect(getMood(state)).toBe('happy');
  });

  it('is neutral in the middle ground', () => {
    const state = { ...base(), hunger: 50, thirst: 50, happiness: 50 };

    expect(getMood(state)).toBe('neutral');
  });
});
