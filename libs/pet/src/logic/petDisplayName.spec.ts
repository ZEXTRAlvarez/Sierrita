import { getPetDisplayName } from './petDisplayName';
import { createInitialPetState } from './petStateFactory';

describe('getPetDisplayName', () => {
  it('returns the chosen name when set', () => {
    const state = { ...createInitialPetState('p1', 'dragon'), petName: 'Chispita' };

    expect(getPetDisplayName(state)).toBe('Chispita');
  });

  it('falls back to the species default when petName is null', () => {
    const state = createInitialPetState('p1', 'dragon');

    expect(getPetDisplayName(state)).toBe('Dragoncito');
  });

  it('falls back to the species default when petName is an empty/whitespace string', () => {
    const state = { ...createInitialPetState('p1', 'cat'), petName: '   ' };

    expect(getPetDisplayName(state)).toBe('Gatito');
  });
});
