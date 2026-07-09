import { renderHook, act } from '@testing-library/react-native';
import { usePet } from './usePet';

const basePet = {
  profileId: 'p1',
  petType: 'dragon' as const,
  petName: null,
  hunger: 80,
  thirst: 80,
  happiness: 80,
  evolutionStage: 0 as const,
  outfitId: 'none',
  totalXp: 0,
  lastSessionAt: 0,
};

let mockPetState: typeof basePet | null = basePet;
jest.mock('jotai', () => ({
  useAtom: jest.fn(() => [
    mockPetState,
    (updater: unknown) => {
      mockPetState = typeof updater === 'function' ? (updater as (mockPrev: typeof basePet | null) => typeof basePet)(mockPetState) : (updater as typeof basePet);
    },
  ]),
  useAtomValue: jest.fn(() => 'p1'),
}));
jest.mock('../../store/atoms', () => ({ petStateAtom: 'petState', activeProfileIdAtom: 'activeProfileId' }));
jest.mock('@sierrita/storage', () => ({
  getPetState: jest.fn(async () => null),
  upsertPetState: jest.fn(async () => undefined),
}));
jest.mock('@sierrita/pet', () => ({
  applyNeedEvent: jest.fn((pet, event) => ({ ...pet, hunger: event.type === 'feed' ? pet.hunger + event.amount : pet.hunger })),
  applySessionDecay: jest.fn((pet) => pet),
  getMood: jest.fn(() => 'happy'),
}));

describe('usePet', () => {
  beforeEach(() => {
    mockPetState = { ...basePet };
  });

  it('exposes the current pet state and its mood', () => {
    const { result } = renderHook(() => usePet());

    expect(result.current.petState).toEqual(basePet);
    expect(result.current.mood).toBe('happy');
  });

  it('feed() applies a feed event to the pet state', () => {
    const { result, rerender } = renderHook(() => usePet());

    act(() => result.current.feed());
    rerender(undefined);

    expect(result.current.petState?.hunger).toBe(105);
  });

  it('renamePet() trims the name and clears it when blank', () => {
    const { result, rerender } = renderHook(() => usePet());

    act(() => result.current.renamePet('  Chispita  '));
    rerender(undefined);
    expect(result.current.petState?.petName).toBe('Chispita');

    act(() => result.current.renamePet('   '));
    rerender(undefined);
    expect(result.current.petState?.petName).toBeNull();
  });
});
