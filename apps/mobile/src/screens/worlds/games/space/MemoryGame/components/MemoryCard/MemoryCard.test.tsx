import React from 'react';
import { Animated } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { MemoryCard } from './MemoryCard';

const baseCard = { id: 1, emoji: '🚀', flipped: false, matched: false };

describe('MemoryCard', () => {
  it('shows the card-back glyph and reports presses when face-down', () => {
    const onPress = jest.fn();
    const { getByText, queryByText, getByTestId } = render(
      <MemoryCard card={baseCard} size={80} locked={false} scale={new Animated.Value(1)} onPress={onPress} />,
    );

    expect(getByText('🔮')).toBeTruthy();
    expect(queryByText('🚀')).toBeNull();

    fireEvent.press(getByTestId('memory-card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('reveals the emoji once flipped', () => {
    const { getByText, queryByText } = render(
      <MemoryCard
        card={{ ...baseCard, flipped: true }}
        size={80}
        locked={false}
        scale={new Animated.Value(1)}
        onPress={jest.fn()}
      />,
    );

    expect(getByText('🚀')).toBeTruthy();
    expect(queryByText('🔮')).toBeNull();
  });

  it('is disabled once matched', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <MemoryCard
        card={{ ...baseCard, matched: true, flipped: true }}
        size={80}
        locked={false}
        scale={new Animated.Value(1)}
        onPress={onPress}
      />,
    );

    fireEvent.press(getByTestId('memory-card'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
