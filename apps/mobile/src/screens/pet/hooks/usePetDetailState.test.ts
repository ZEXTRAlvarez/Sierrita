import { renderHook, act } from '@testing-library/react-native';
import { upsertPetState } from '@sierrita/storage';
import { usePetDetailState } from './usePetDetailState';

const basePet = {
  profileId: 'p1',
  petType: 'dragon',
  petName: null,
  hunger: 80,
  thirst: 80,
  happiness: 80,
  evolutionStage: 0,
  outfitId: 'none',
  totalXp: 0,
  lastSessionAt: 0,
};

let mockAtomValue: typeof basePet | null = basePet;
jest.mock('jotai', () => ({
  useAtom: jest.fn(() => [
    mockAtomValue,
    (updater: unknown) => {
      mockAtomValue =
        typeof updater === 'function'
          ? (updater as (mockPrev: typeof basePet | null) => typeof basePet)(mockAtomValue)
          : (updater as typeof basePet);
    },
  ]),
}));
jest.mock('../../../store/atoms', () => ({ petStateAtom: 'petState' }));
jest.mock('@sierrita/storage', () => ({ upsertPetState: jest.fn(async () => undefined) }));

describe('usePetDetailState', () => {
  beforeEach(() => {
    mockAtomValue = { ...basePet };
    jest.clearAllMocks();
  });

  it('resolves the current outfit definition from the selected outfit id', () => {
    const { result } = renderHook(() => usePetDetailState());

    expect(result.current.currentOutfit.id).toBe('none');
  });

  it('applyOutfit updates local state and persists the change', () => {
    const { result } = renderHook(() => usePetDetailState());

    act(() => result.current.applyOutfit('hat'));

    expect(result.current.selectedOutfit).toBe('hat');
    expect(upsertPetState).toHaveBeenCalledWith(expect.objectContaining({ outfitId: 'hat' }));
  });

  it('applyName trims the name and closes the rename modal', () => {
    const { result } = renderHook(() => usePetDetailState());
    act(() => result.current.setShowRename(true));

    act(() => result.current.applyName('  Chispita  '));

    expect(result.current.showRename).toBe(false);
    expect(upsertPetState).toHaveBeenCalledWith(expect.objectContaining({ petName: 'Chispita' }));
  });

  it('applyName treats a blank name as clearing the custom name', () => {
    const { result } = renderHook(() => usePetDetailState());

    act(() => result.current.applyName('   '));

    expect(upsertPetState).toHaveBeenCalledWith(expect.objectContaining({ petName: null }));
  });
});
