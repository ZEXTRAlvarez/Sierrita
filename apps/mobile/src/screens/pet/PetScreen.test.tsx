import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import PetScreen from './PetScreen';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));
jest.mock('expo-linear-gradient', () => ({ LinearGradient: 'LinearGradient' }));
jest.mock('expo-blur', () => {
  const { View } = require('react-native');
  return { BlurView: View };
});
jest.mock('../../components/PetAnimation', () => ({
  PetAnimation: () => null,
}));

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
const mockFeed = jest.fn();
jest.mock('../../hooks/usePet', () => ({
  usePet: () => ({
    petState: mockPet,
    mood: 'happy',
    feed: mockFeed,
    giveWater: jest.fn(),
    play: jest.fn(),
    renamePet: jest.fn(),
  }),
}));

describe('PetScreen', () => {
  beforeEach(() => mockNavigate.mockClear());

  it('shows the pet name and mood', () => {
    const { getByText } = renderWithProviders(<PetScreen />);

    expect(getByText('Chispita')).toBeTruthy();
    expect(getByText('¡Estoy en mi mejor momento! ✨')).toBeTruthy();
  });

  it('calls feed when the Alimentar action is pressed', () => {
    const { getByText } = renderWithProviders(<PetScreen />);

    fireEvent.press(getByText('Alimentar'));

    expect(mockFeed).toHaveBeenCalledTimes(1);
  });

  it('navigates to PetDetail when the wardrobe button is pressed', () => {
    const { getByText } = renderWithProviders(<PetScreen />);

    fireEvent.press(getByText('🎽 Vestidor y evolución'));

    expect(mockNavigate).toHaveBeenCalledWith('PetDetail');
  });
});
