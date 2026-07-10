import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import BalanceGame from './BalanceGame';

describe('BalanceGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows round progress, the scale and the three fixed answer choices', () => {
    const { getByText, getAllByTestId } = render(
      <BalanceGame
        params={{ mode: 'count' }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 5')).toBeTruthy();
    expect(getAllByTestId('balance-choice')).toHaveLength(3);
    expect(getAllByTestId('balance-pan-left')).toHaveLength(1);
    expect(getAllByTestId('balance-pan-right')).toHaveLength(1);
  });

  it('reports the round and finishes the game once roundCount is reached', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getAllByTestId } = render(
      <BalanceGame
        params={{ mode: 'weight' }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={2}
      />,
    );

    const buttons = getAllByTestId('balance-choice');
    await act(async () => {
      fireEvent.press(buttons[0]);
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('supports sum mode', () => {
    const { getAllByTestId } = render(
      <BalanceGame
        params={{ mode: 'sum' }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={3}
      />,
    );

    expect(getAllByTestId('balance-choice')).toHaveLength(3);
  });
});
