import React from 'react';
import { Animated } from 'react-native';
import { render, fireEvent, act } from '@testing-library/react-native';
import MemoryGame from './MemoryGame';

const fixedDeck = [
  { id: 0, emoji: '🚀', flipped: false, matched: false },
  { id: 1, emoji: '🌟', flipped: false, matched: false },
  { id: 2, emoji: '🚀', flipped: false, matched: false },
  { id: 3, emoji: '🌟', flipped: false, matched: false },
];

jest.mock('./logic/buildDeck', () => ({
  buildDeck: jest.fn(() => fixedDeck.map((c) => ({ ...c }))),
}));

// The card-flip bounce chains two Animated.spring calls per press. Its physics
// settling runs on real requestAnimationFrame timers that outlive fake timers
// and can fire after the test environment tears down, so run it synchronously.
jest.spyOn(Animated, 'spring').mockImplementation(
  () =>
    ({
      start: (cb?: (result: { finished: boolean }) => void) =>
        cb?.({ finished: true }),
    }) as never,
);

describe('MemoryGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows the pair progress and one card per deck entry', () => {
    const { getByText, getAllByTestId } = render(
      <MemoryGame
        params={{ pairs: 2, flipDelay: 500 }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={1}
        difficulty={1}
      />,
    );

    expect(getByText('Pares: 0 / 2')).toBeTruthy();
    expect(getAllByTestId('memory-card')).toHaveLength(4);
  });

  it('finishes the game once every pair is matched', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getAllByTestId, getByText } = render(
      <MemoryGame
        params={{ pairs: 2, flipDelay: 500 }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    const cards = getAllByTestId('memory-card');
    await act(async () => {
      fireEvent.press(cards[0]);
    });
    await act(async () => {
      fireEvent.press(cards[2]);
    }); // matches card 0
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    await act(async () => {
      fireEvent.press(cards[1]);
    });
    await act(async () => {
      fireEvent.press(cards[3]);
    }); // matches card 1
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(getByText('Pares: 2 / 2')).toBeTruthy();
    expect(onRoundComplete).toHaveBeenCalledWith(true, 0);

    act(() => jest.advanceTimersByTime(800));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });
});
