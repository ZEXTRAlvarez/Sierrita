import React from 'react';
import { act, fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import ProfileSelectScreen from './ProfileSelectScreen';

const mockReplace = jest.fn();
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn(() => false);
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: mockReplace,
    navigate: mockNavigate,
    goBack: mockGoBack,
    canGoBack: mockCanGoBack,
  }),
}));
jest.mock('expo-linear-gradient', () => ({ LinearGradient: 'LinearGradient' }));
jest.mock('../../components/PetAnimation', () => ({
  PetAnimation: () => null,
}));

const mockProfiles = [{ id: 'p1', name: 'Sofía', age: 5, avatar: 'dragon' }];
const mockSelectProfile = jest.fn();
const mockRemoveProfile = jest.fn();
jest.mock('../../hooks/useProfiles', () => ({
  useProfiles: () => ({
    profiles: mockProfiles,
    selectProfile: mockSelectProfile,
    removeProfile: mockRemoveProfile,
  }),
}));

jest.mock('../../store/atoms', () => ({
  activeProfileIdAtom: 'activeProfileId',
}));
jest.mock('jotai', () => ({ useAtomValue: () => null }));

describe('ProfileSelectScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockReplace.mockClear();
    mockNavigate.mockClear();
    mockGoBack.mockClear();
    mockCanGoBack.mockReturnValue(false);
    mockSelectProfile.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('lists the existing profiles and an add-profile card', () => {
    const { getByText } = renderWithProviders(<ProfileSelectScreen />);

    expect(getByText('Sofía')).toBeTruthy();
    expect(getByText('Nuevo perfil')).toBeTruthy();
  });

  it('selects a profile and navigates to Main when its card is pressed', () => {
    const { getByText } = renderWithProviders(<ProfileSelectScreen />);

    fireEvent.press(getByText('Sofía'));
    act(() => jest.advanceTimersByTime(0));

    expect(mockSelectProfile).toHaveBeenCalledWith('p1');
    expect(mockReplace).toHaveBeenCalledWith('Main');
  });

  it('navigates to Onboarding when the add-profile card is pressed', () => {
    const { getByText } = renderWithProviders(<ProfileSelectScreen />);

    fireEvent.press(getByText('Nuevo perfil'));

    expect(mockNavigate).toHaveBeenCalledWith('Onboarding');
  });
});
