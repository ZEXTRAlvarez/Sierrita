import React from 'react';
import { act } from '@testing-library/react-native';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import SplashScreen from './SplashScreen';

const mockReplace = jest.fn();
jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ replace: mockReplace }) }));
jest.mock('../../store/atoms', () => ({
  profilesAtom: 'profiles',
  activeProfileIdAtom: 'activeProfileId',
  appReadyAtom: 'appReady',
}));

let mockAppReady = true;
let mockProfiles: { id: string }[] = [];
let mockActiveProfileId: string | null = null;

jest.mock('jotai', () => ({
  useAtomValue: (atom: string) => {
    if (atom === 'profiles') return mockProfiles;
    if (atom === 'activeProfileId') return mockActiveProfileId;
    if (atom === 'appReady') return mockAppReady;
    return null;
  },
}));

describe('SplashScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockReplace.mockClear();
    mockAppReady = true;
    mockProfiles = [];
    mockActiveProfileId = null;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows the logo and title', () => {
    const { getByText } = renderWithProviders(<SplashScreen />);

    expect(getByText('Sierrita')).toBeTruthy();
    expect(getByText('¡Aprender es divertido!')).toBeTruthy();
  });

  it('redirects to Onboarding when there is no profile yet', () => {
    renderWithProviders(<SplashScreen />);

    act(() => { jest.advanceTimersByTime(2400); });

    expect(mockReplace).toHaveBeenCalledWith('Onboarding');
  });

  it('redirects to ProfileSelect when profiles exist but none is active', () => {
    mockProfiles = [{ id: 'p1' }];
    renderWithProviders(<SplashScreen />);

    act(() => { jest.advanceTimersByTime(2400); });

    expect(mockReplace).toHaveBeenCalledWith('ProfileSelect');
  });

  it('redirects to Main when a profile is already active', () => {
    mockActiveProfileId = 'p1';
    renderWithProviders(<SplashScreen />);

    act(() => { jest.advanceTimersByTime(2400); });

    expect(mockReplace).toHaveBeenCalledWith('Main');
  });

  it('does not redirect before the app is ready', () => {
    mockAppReady = false;
    renderWithProviders(<SplashScreen />);

    act(() => { jest.advanceTimersByTime(5000); });

    expect(mockReplace).not.toHaveBeenCalled();
  });
});
