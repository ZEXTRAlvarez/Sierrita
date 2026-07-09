import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import WorldsScreen from './WorldsScreen';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useIsFocused: () => true,
}));
jest.mock('../../store/atoms', () => ({ activeProfileAtom: 'activeProfile' }));
jest.mock('jotai', () => ({
  useAtomValue: () => ({ id: 'p1', name: 'Sofía', age: 5 }),
}));

describe('WorldsScreen', () => {
  beforeEach(() => mockNavigate.mockClear());

  it('shows the profile age badge and every world', () => {
    const { getByText } = renderWithProviders(<WorldsScreen />);

    expect(getByText('Sofía · 5 años')).toBeTruthy();
    expect(getByText('Selva Mágica')).toBeTruthy();
    expect(getByText('Océano Profundo')).toBeTruthy();
    expect(getByText('Espacio Estelar')).toBeTruthy();
  });

  it('navigates to Game with the world and game id when an unlocked game is tapped', () => {
    const { getByText } = renderWithProviders(<WorldsScreen />);

    fireEvent.press(getByText('Trazos y Letras'));

    expect(mockNavigate).toHaveBeenCalledWith('Game', {
      worldId: 'jungle',
      gameId: 'tracing',
    });
  });
});
