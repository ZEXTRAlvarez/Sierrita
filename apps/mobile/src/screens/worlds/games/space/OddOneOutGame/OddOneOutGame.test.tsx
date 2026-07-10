import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import OddOneOutGame from './OddOneOutGame';

describe('OddOneOutGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows round progress and the requested number of items', () => {
    const { getByText, getAllByTestId } = render(
      <OddOneOutGame
        params={{ itemCount: 4, mode: 'category' }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 5')).toBeTruthy();
    expect(getAllByTestId('odd-one-out-choice')).toHaveLength(4);
  });

  it('reports the round and finishes the game once roundCount is reached', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getAllByTestId } = render(
      <OddOneOutGame
        params={{ itemCount: 4, mode: 'category' }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    const buttons = getAllByTestId('odd-one-out-choice');
    await act(async () => {
      fireEvent.press(buttons[0]);
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('supports attribute mode with more items', () => {
    const { getAllByTestId } = render(
      <OddOneOutGame
        params={{ itemCount: 5, mode: 'attribute' }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={3}
      />,
    );

    expect(getAllByTestId('odd-one-out-choice')).toHaveLength(5);
  });
});
