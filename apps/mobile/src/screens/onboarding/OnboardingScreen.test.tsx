import React from 'react';
import { act, fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import OnboardingScreen from './OnboardingScreen';

const mockReplace = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: mockReplace }),
}));

const mockAddProfile = jest.fn();
const mockSelectProfile = jest.fn();
jest.mock('../../hooks/useProfiles', () => ({
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

// PetAnimation renders an expo-video player, which needs native bindings
// unavailable under @react-native/jest-preset.
jest.mock('../../components/PetAnimation', () => ({
  PetAnimation: () => null,
}));

describe('OnboardingScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockReplace.mockClear();
    mockAddProfile.mockReset();
    mockSelectProfile.mockClear();
    mockGetParentConfig.mockReset();
    mockUpsertParentConfig.mockReset();
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
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('walks through name, age and pet, then shows the app walkthrough before creating a profile', async () => {
    mockAddProfile.mockResolvedValue({ id: 'p1' });
    const { getByText, getByPlaceholderText, getByTestId } =
      renderWithProviders(<OnboardingScreen />);

    fireEvent.changeText(getByPlaceholderText('Tu nombre...'), 'Sofía');
    fireEvent.press(getByText('¡Siguiente!'));

    fireEvent.press(getByText('5'));
    fireEvent.press(getByText('¡Siguiente!'));

    fireEvent.press(getByText('Dragoncito'));
    await act(async () => {
      fireEvent.press(getByText('¡Empezar!'));
    });

    expect(mockAddProfile).toHaveBeenCalledWith('Sofía', 5, 'dragon');
    expect(mockSelectProfile).toHaveBeenCalledWith('p1');
    expect(mockReplace).not.toHaveBeenCalled();
    expect(getByText('Este es tu Inicio')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByTestId('app-walkthrough-skip'));
    });
    act(() => jest.advanceTimersByTime(0));

    expect(mockUpsertParentConfig).toHaveBeenCalledWith(
      expect.objectContaining({ hasSeenWalkthrough: true }),
    );
    expect(mockReplace).toHaveBeenCalledWith('Main');
  });
});
