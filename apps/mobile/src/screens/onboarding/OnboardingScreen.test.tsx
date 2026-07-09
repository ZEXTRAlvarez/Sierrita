import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import OnboardingScreen from './OnboardingScreen';

const mockReplace = jest.fn();
jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ replace: mockReplace }) }));

const mockAddProfile = jest.fn();
const mockSelectProfile = jest.fn();
jest.mock('../../hooks/useProfiles', () => ({
  useProfiles: () => ({ addProfile: mockAddProfile, selectProfile: mockSelectProfile }),
}));

describe('OnboardingScreen', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockAddProfile.mockReset();
    mockSelectProfile.mockClear();
  });

  it('walks through name, age and pet before creating a profile', async () => {
    mockAddProfile.mockResolvedValue({ id: 'p1' });
    const { getByText, getByPlaceholderText } = renderWithProviders(<OnboardingScreen />);

    fireEvent.changeText(getByPlaceholderText('Tu nombre...'), 'Sofía');
    fireEvent.press(getByText('¡Siguiente!'));

    fireEvent.press(getByText('5'));
    fireEvent.press(getByText('¡Siguiente!'));

    fireEvent.press(getByText('Dragoncito'));
    await fireEvent.press(getByText('¡Empezar!'));

    expect(mockAddProfile).toHaveBeenCalledWith('Sofía', 5, 'dragon');
    expect(mockSelectProfile).toHaveBeenCalledWith('p1');
    expect(mockReplace).toHaveBeenCalledWith('Main');
  });
});
