import React from 'react';
import { Animated } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { WorldSection } from './WorldSection';
import { WORLDS } from '../../data/worldsContent';

const world = WORLDS[0];

describe('WorldSection', () => {
  it('shows how many games are unlocked for the given profile age', () => {
    const { getByText } = render(
      <WorldSection
        world={world}
        profileAge={5}
        entrance={new Animated.Value(1)}
        onPressGame={jest.fn()}
      />,
    );

    expect(getByText('2/4')).toBeTruthy();
  });

  it('calls onPressGame with the tapped game id', () => {
    const onPressGame = jest.fn();
    const { getByText } = render(
      <WorldSection
        world={world}
        profileAge={10}
        entrance={new Animated.Value(1)}
        onPressGame={onPressGame}
      />,
    );

    fireEvent.press(getByText(world.games[0].name));

    expect(onPressGame).toHaveBeenCalledWith(world.games[0].id);
  });
});
