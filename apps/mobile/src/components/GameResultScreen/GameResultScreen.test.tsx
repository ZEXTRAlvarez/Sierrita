import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import GameResultScreen from './GameResultScreen';
import type { GameSummary } from '@sierrita/games';

const mockRewardXp = jest.fn();
jest.mock('../../hooks/usePet', () => ({
  usePet: () => ({ rewardXp: mockRewardXp }),
}));

const summary: GameSummary = {
  gameId: 'tracing',
  world: 'jungle',
  correctRounds: 4,
  totalRounds: 5,
  scorePercent: 0.8,
  stars: 2,
  xpEarned: 40,
  durationSecs: 55,
  difficulty: 1,
};

describe('GameResultScreen', () => {
  beforeEach(() => {
    mockRewardXp.mockClear();
    jest.useFakeTimers();
  });
  afterEach(() => {
    act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
  });

  it('shows the stats and star message, and rewards the earned xp on mount', () => {
    const { getByText } = render(
      <GameResultScreen
        summary={summary}
        onPlayAgain={jest.fn()}
        onBack={jest.fn()}
      />,
    );

    expect(getByText('¡Súper bien!')).toBeTruthy();
    expect(getByText('4/5')).toBeTruthy();
    expect(getByText('+40 ⭐')).toBeTruthy();
    expect(mockRewardXp).toHaveBeenCalledWith(40);
  });

  it('calls onPlayAgain and onBack from their buttons', () => {
    const onPlayAgain = jest.fn();
    const onBack = jest.fn();
    const { getByText } = render(
      <GameResultScreen
        summary={summary}
        onPlayAgain={onPlayAgain}
        onBack={onBack}
      />,
    );

    fireEvent.press(getByText('🔄 Jugar de nuevo'));
    fireEvent.press(getByText('🏠 Volver'));

    expect(onPlayAgain).toHaveBeenCalledTimes(1);
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
