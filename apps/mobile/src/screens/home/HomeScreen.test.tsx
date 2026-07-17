import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import HomeScreen from './HomeScreen';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useIsFocused: () => true,
}));
jest.mock('expo-linear-gradient', () => ({ LinearGradient: 'LinearGradient' }));
jest.mock('../../components/PetAnimation', () => ({
  PetAnimation: () => null,
}));

const mockProfile = { id: 'p1', name: 'Sofía', age: 5, avatar: 'dragon' };
const mockPet = {
  profileId: 'p1',
  petType: 'dragon',
  petName: 'Chispita',
  hunger: 80,
  thirst: 80,
  happiness: 80,
  evolutionStage: 1,
  outfitId: 'none',
  totalXp: 200,
  lastSessionAt: 0,
};
let mockMood = 'happy';
jest.mock('../../store/atoms', () => ({
  activeProfileAtom: 'activeProfile',
  petStateAtom: 'petState',
  petMoodAtom: 'petMood',
  worldsEnabledAtom: 'worldsEnabled',
}));
jest.mock('jotai', () => ({
  useAtomValue: (atom: string) => {
    if (atom === 'activeProfile') return mockProfile;
    if (atom === 'petState') return mockPet;
    if (atom === 'petMood') return mockMood;
    if (atom === 'worldsEnabled') return ['jungle', 'ocean', 'space'];
    return null;
  },
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    mockMood = 'happy';
    mockNavigate.mockClear();
  });

  it('greets the active profile and shows its pet mood and world cards', () => {
    const { getByText } = renderWithProviders(<HomeScreen />);

    expect(getByText('¡Hola, Sofía!')).toBeTruthy();
    expect(getByText('¡Estoy de gran humor! ✨')).toBeTruthy();
    expect(getByText('Escritura')).toBeTruthy();
  });

  it('navigates to Parents when the settings button is pressed', () => {
    const { getByTestId } = renderWithProviders(<HomeScreen />);

    fireEvent.press(getByTestId('home-header-parent-btn'));

    expect(mockNavigate).toHaveBeenCalledWith('Parents');
  });

  it('navigates to Worlds when a world card is pressed', () => {
    const { getByText } = renderWithProviders(<HomeScreen />);

    fireEvent.press(getByText('Escritura'));

    expect(mockNavigate).toHaveBeenCalledWith('Worlds');
  });
});
