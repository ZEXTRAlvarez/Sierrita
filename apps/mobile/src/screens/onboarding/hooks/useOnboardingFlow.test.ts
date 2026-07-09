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

describe('useOnboardingFlow', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockReplace.mockClear();
    mockAddProfile.mockReset();
    mockSelectProfile.mockClear();
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

  it('creates a profile, selects it and navigates to Main', async () => {
    mockAddProfile.mockResolvedValue({ id: 'p1' });
    const { result } = renderHook(() => useOnboardingFlow());

    act(() => result.current.setName('Sofía'));
    act(() => result.current.setAge(5));
    act(() => result.current.setPet('dragon'));

    await act(async () => result.current.handleCreate());

    expect(mockAddProfile).toHaveBeenCalledWith('Sofía', 5, 'dragon');
    expect(mockSelectProfile).toHaveBeenCalledWith('p1');
    expect(mockReplace).toHaveBeenCalledWith('Main');
  });

  it('does nothing when required fields are missing', async () => {
    const { result } = renderHook(() => useOnboardingFlow());

    await act(async () => result.current.handleCreate());

    expect(mockAddProfile).not.toHaveBeenCalled();
  });
});
