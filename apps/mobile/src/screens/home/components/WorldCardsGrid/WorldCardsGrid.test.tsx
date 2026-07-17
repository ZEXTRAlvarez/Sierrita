import React from 'react';
import { Animated } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { WorldCardsGrid } from './WorldCardsGrid';

describe('WorldCardsGrid', () => {
  it('renders one card per world, each with its subject and game count', () => {
    const { getByText, getAllByText } = render(
      <WorldCardsGrid
        cardEntrance={new Animated.Value(1)}
        onPressWorld={jest.fn()}
      />,
    );

    expect(getByText('Escritura')).toBeTruthy();
    expect(getByText('Matemáticas')).toBeTruthy();
    expect(getByText('Lógica')).toBeTruthy();
    // Selva Mágica, Océano Profundo y Espacio Estelar tienen 6 juegos cada uno.
    expect(getAllByText('6 juegos')).toHaveLength(3);
  });

  it('calls onPressWorld when a card is tapped', () => {
    const onPressWorld = jest.fn();
    const { getByText } = render(
      <WorldCardsGrid
        cardEntrance={new Animated.Value(1)}
        onPressWorld={onPressWorld}
      />,
    );

    fireEvent.press(getByText('Escritura'));

    expect(onPressWorld).toHaveBeenCalledTimes(1);
  });
});
