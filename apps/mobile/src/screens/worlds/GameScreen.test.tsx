import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import GameScreen from './GameScreen';

const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
  useRoute: () => ({ params: { worldId: 'jungle', gameId: 'tracing' } }),
}));

jest.mock('./data/gameRegistry', () => ({
  GAME_COMPONENT: {
    tracing: ({ roundCount }: { roundCount: number }) => {
      const { Text } = require('react-native');
      return <Text>Juego de prueba · {roundCount} rondas</Text>;
    },
  },
  WORLD_COLOR: { jungle: '#4CAF50' },
}));

jest.mock('@sierrita/games', () => ({
  getGameConfig: () => ({
    titleEs: 'Trazos y Letras',
    roundCount: 3,
    params: () => ({}),
  }),
}));

const mockStartSession = jest.fn();
const mockFinishSession = jest.fn();
let mockSessionState: Record<string, unknown> = {};
jest.mock('../../hooks/useGameSession', () => ({
  useGameSession: () => mockSessionState,
}));

describe('GameScreen', () => {
  beforeEach(() => {
    mockGoBack.mockClear();
    mockStartSession.mockClear();
    mockSessionState = {
      session: { rounds: [] },
      difficultyState: { currentLevel: 1 },
      summary: null,
      isFinished: false,
      startSession: mockStartSession,
      recordRound: jest.fn(),
      finishSession: mockFinishSession,
    };
  });

  it('shows a loading spinner while the session has not started', () => {
    mockSessionState = {
      ...mockSessionState,
      session: null,
      difficultyState: null,
    };
    const { UNSAFE_queryByType } = renderWithProviders(<GameScreen />);
    const ActivityIndicator = require('react-native').ActivityIndicator;

    expect(UNSAFE_queryByType(ActivityIndicator)).toBeTruthy();
  });

  it('renders the header, progress dots and the active game once the session is ready', () => {
    const { getByText } = renderWithProviders(<GameScreen />);

    expect(getByText('Trazos y Letras')).toBeTruthy();
    expect(getByText('Juego de prueba · 3 rondas')).toBeTruthy();
  });

  it('navigates back when the close button is pressed', () => {
    const { getByText } = renderWithProviders(<GameScreen />);

    fireEvent.press(getByText('✕'));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
