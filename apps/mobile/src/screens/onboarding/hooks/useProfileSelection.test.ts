import { act, renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useProfileSelection } from './useProfileSelection';

const mockReplace = jest.fn();
const mockCanGoBack = jest.fn(() => true);
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: mockReplace, canGoBack: mockCanGoBack }),
}));

const mockProfiles = [{ id: 'p1', name: 'Sofía', age: 5, avatar: 'dragon' }];
const mockSelectProfile = jest.fn();
const mockRemoveProfile = jest.fn();
jest.mock('../../../hooks/useProfiles', () => ({
  useProfiles: () => ({
    profiles: mockProfiles,
    selectProfile: mockSelectProfile,
    removeProfile: mockRemoveProfile,
  }),
}));

describe('useProfileSelection', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockReplace.mockClear();
    mockSelectProfile.mockClear();
    mockRemoveProfile.mockClear();
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
    (Alert.alert as jest.Mock).mockRestore();
  });

  it('selects the profile and navigates to Main', () => {
    const { result } = renderHook(() => useProfileSelection());

    result.current.handleSelect('p1');

    expect(mockSelectProfile).toHaveBeenCalledWith('p1');
    expect(mockReplace).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(mockReplace).toHaveBeenCalledWith('Main');
  });

  it('confirms before deleting a profile', () => {
    const { result } = renderHook(() => useProfileSelection());

    result.current.handleDelete('p1', 'Sofía');

    expect(Alert.alert).toHaveBeenCalledWith(
      'Borrar perfil',
      expect.stringContaining('Sofía'),
      expect.any(Array),
    );
  });
});
