import { renderHook, act } from '@testing-library/react-native';
import { useProfiles } from './useProfiles';

let mockProfiles: any[] = [];
let mockActiveId: string | null = null;
const mockSetPetState = jest.fn();
jest.mock('jotai', () => ({
  useAtom: jest.fn((atom: string) => {
    if (atom === 'profiles') {
      return [mockProfiles, (updater: unknown) => {
        mockProfiles = typeof updater === 'function' ? (updater as (mockPrev: any[]) => any[])(mockProfiles) : (updater as any[]);
      }];
    }
    return [mockActiveId, (updater: unknown) => {
      mockActiveId = typeof updater === 'function' ? (updater as (mockPrev: string | null) => string | null)(mockActiveId) : (updater as string | null);
    }];
  }),
  useSetAtom: jest.fn(() => mockSetPetState),
}));
jest.mock('../../store/atoms', () => ({
  profilesAtom: 'profiles',
  activeProfileIdAtom: 'activeProfileId',
  petStateAtom: 'petState',
}));
jest.mock('@sierrita/storage', () => ({
  getAllProfiles: jest.fn(async () => []),
  createProfile: jest.fn(async () => undefined),
  deleteProfile: jest.fn(async () => undefined),
  upsertPetState: jest.fn(async () => undefined),
  upsertParentConfig: jest.fn(async () => undefined),
}));
jest.mock('@sierrita/pet', () => ({ createInitialPetState: jest.fn(() => ({})) }));
jest.mock('@sierrita/parents', () => ({ createDefaultParentConfig: jest.fn(() => ({})) }));

describe('useProfiles', () => {
  beforeEach(() => {
    mockProfiles = [];
    mockActiveId = null;
    mockSetPetState.mockClear();
  });

  it('adds a new profile to the list', async () => {
    const { result, rerender } = renderHook(() => useProfiles());

    await act(async () => {
      await result.current.addProfile('Sofía', 5, 'dragon');
    });
    rerender(undefined);

    expect(result.current.profiles).toHaveLength(1);
    expect(result.current.profiles[0]).toMatchObject({ name: 'Sofía', age: 5, avatar: 'dragon' });
  });

  it('resets the active profile and pet state when the active profile is removed', async () => {
    mockProfiles = [{ id: 'p1', name: 'Sofía', age: 5, avatar: 'dragon', createdAt: 0 }];
    mockActiveId = 'p1';
    const { result, rerender } = renderHook(() => useProfiles());

    await act(async () => {
      await result.current.removeProfile('p1');
    });
    rerender(undefined);

    expect(result.current.profiles).toHaveLength(0);
    expect(result.current.activeProfileId).toBeNull();
    expect(mockSetPetState).toHaveBeenCalledWith(null);
  });

  it('resolves the active profile object from the active id', () => {
    mockProfiles = [{ id: 'p1', name: 'Sofía', age: 5, avatar: 'dragon', createdAt: 0 }];
    mockActiveId = 'p1';
    const { result } = renderHook(() => useProfiles());

    expect(result.current.activeProfile).toMatchObject({ name: 'Sofía' });
  });
});
