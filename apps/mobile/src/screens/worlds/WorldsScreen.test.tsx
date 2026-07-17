import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { TamaguiProvider } from '@tamagui/core';
import { tamaguiConfig } from '@sierrita/ui';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import WorldsScreen from './WorldsScreen';

function wrapped() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <WorldsScreen />
    </TamaguiProvider>
  );
}

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useIsFocused: () => true,
}));
jest.mock('../../store/atoms', () => ({
  activeProfileAtom: 'activeProfile',
  worldsEnabledAtom: 'worldsEnabled',
}));
let mockWorldsEnabled = ['jungle', 'ocean', 'space'];
jest.mock('jotai', () => ({
  useAtomValue: (atom: string) => {
    if (atom === 'worldsEnabled') return mockWorldsEnabled;
    return { id: 'p1', name: 'Sofía', age: 5 };
  },
}));

describe('WorldsScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockWorldsEnabled = ['jungle', 'ocean', 'space'];
  });

  it('shows the profile age badge and every world', () => {
    const { getByText } = renderWithProviders(<WorldsScreen />);

    expect(getByText('Sofía · 5 años')).toBeTruthy();
    expect(getByText('Selva Mágica')).toBeTruthy();
    expect(getByText('Océano Profundo')).toBeTruthy();
    expect(getByText('Espacio Estelar')).toBeTruthy();
  });

  it('hides a world the parent disabled', () => {
    mockWorldsEnabled = ['jungle', 'space'];
    const { getByText, queryByText } = renderWithProviders(<WorldsScreen />);

    expect(getByText('Selva Mágica')).toBeTruthy();
    expect(getByText('Espacio Estelar')).toBeTruthy();
    expect(queryByText('Océano Profundo')).toBeNull();
  });

  it('does not crash when a disabled world is re-enabled while the screen stays mounted', () => {
    mockWorldsEnabled = ['jungle', 'space'];
    const { getByText, queryByText, rerender } = renderWithProviders(
      <WorldsScreen />,
    );
    expect(queryByText('Océano Profundo')).toBeNull();

    mockWorldsEnabled = ['jungle', 'ocean', 'space'];
    expect(() => rerender(wrapped())).not.toThrow();
    expect(getByText('Océano Profundo')).toBeTruthy();
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
