import React from 'react';
import { Animated } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { GameCard } from './GameCard';
import { WORLDS } from '../../data/worldsContent';

const world = WORLDS[0];
const unlockedGame = world.games[0];
const lockedGame = { ...world.games[1], minAge: 99 };

describe('GameCard', () => {
  it('calls onPress when an unlocked game is tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <GameCard
        game={unlockedGame}
        world={world}
        profileAge={10}
        cardAnim={new Animated.Value(1)}
        onPress={onPress}
      />,
    );

    fireEvent.press(getByText(unlockedGame.name));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows a lock badge and ignores presses for a game above the profile age', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <GameCard
        game={lockedGame}
        world={world}
        profileAge={4}
        cardAnim={new Animated.Value(1)}
        onPress={onPress}
      />,
    );

    expect(getByText('🔒 99+')).toBeTruthy();

    fireEvent.press(getByText(lockedGame.name));

    expect(onPress).not.toHaveBeenCalled();
  });
});
