import { act, renderHook } from '@testing-library/react-native';
import { useOnboardingFlow } from './useOnboardingFlow';

const mockReplace = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: mockReplace }),
}));

const mockAddProfile = jest.fn();
const mockSelectProfile = jest.fn();
jest.mock('../../../hooks/useProfiles', () => ({
  useProfiles: () => ({
    addProfile: mockAddProfile,
    selectProfile: mockSelectProfile,
  }),
}));

const mockGetParentConfig = jest.fn();
const mockUpsertParentConfig = jest.fn();
jest.mock('@sierrita/storage', () => ({
  getParentConfig: (...args: unknown[]) => mockGetParentConfig(...args),
  upsertParentConfig: (...args: unknown[]) => mockUpsertParentConfig(...args),
}));

describe('useOnboardingFlow', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockReplace.mockClear();
    mockAddProfile.mockReset();
    mockSelectProfile.mockClear();
    mockGetParentConfig.mockReset();
    mockUpsertParentConfig.mockReset();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('starts on the name step', () => {
    const { result } = renderHook(() => useOnboardingFlow());

    expect(result.current.step).toBe('name');
  });

  it('advances the step when goNext is called', () => {
    const { result } = renderHook(() => useOnboardingFlow());

    act(() => result.current.goNext('age'));

    expect(result.current.step).toBe('age');
  });

  it('creates a profile, selects it and shows the walkthrough step', async () => {
    mockAddProfile.mockResolvedValue({ id: 'p1' });
    const { result } = renderHook(() => useOnboardingFlow());

    act(() => result.current.setName('Sofía'));
    act(() => result.current.setAge(5));
    act(() => result.current.setPet('dragon'));

    await act(async () => result.current.handleCreate());

    expect(mockAddProfile).toHaveBeenCalledWith('Sofía', 5, 'dragon');
    expect(mockSelectProfile).toHaveBeenCalledWith('p1');
    expect(result.current.step).toBe('walkthrough');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('finishWalkthrough persists hasSeenWalkthrough and navigates to Main', async () => {
    mockAddProfile.mockResolvedValue({ id: 'p1' });
    mockGetParentConfig.mockResolvedValue({
      profileId: 'p1',
      pinHash: '',
      maxSessionMinutes: 30,
      worldsEnabled: ['jungle', 'ocean', 'space'],
      updatedAt: 0,
      hasSeenWalkthrough: false,
      fontScale: 'normal',
      highContrast: false,
    });
    const { result } = renderHook(() => useOnboardingFlow());

    act(() => result.current.setName('Sofía'));
    act(() => result.current.setAge(5));
    act(() => result.current.setPet('dragon'));
    await act(async () => result.current.handleCreate());

    await act(async () => result.current.finishWalkthrough());
    act(() => jest.advanceTimersByTime(0));

    expect(mockGetParentConfig).toHaveBeenCalledWith('p1');
    expect(mockUpsertParentConfig).toHaveBeenCalledWith(
      expect.objectContaining({ hasSeenWalkthrough: true }),
    );
    expect(mockReplace).toHaveBeenCalledWith('Main');
  });

  it('ignores a second handleCreate fired before the first one resolves (fast double-tap)', async () => {
    let resolveAddProfile: (profile: { id: string }) => void;
    mockAddProfile.mockReturnValue(
      new Promise((resolve) => {
        resolveAddProfile = resolve;
      }),
    );
    const { result } = renderHook(() => useOnboardingFlow());

    act(() => result.current.setName('Sofía'));
    act(() => result.current.setAge(5));
    act(() => result.current.setPet('dragon'));

    let firstCall: Promise<void>;
    act(() => {
      firstCall = result.current.handleCreate();
      result.current.handleCreate();
    });

    resolveAddProfile!({ id: 'p1' });
    await act(async () => firstCall);

    expect(mockAddProfile).toHaveBeenCalledTimes(1);
  });

  it('does nothing when required fields are missing', async () => {
    const { result } = renderHook(() => useOnboardingFlow());

    await act(async () => result.current.handleCreate());

    expect(mockAddProfile).not.toHaveBeenCalled();
  });
});
