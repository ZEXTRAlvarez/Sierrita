import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import MatterGame from './MatterGame';

describe('MatterGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows round progress, the item and 3 state options', () => {
    const { getByText, getAllByTestId } = render(
      <MatterGame
        params={{ tiers: [1], transformChance: 0 }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={6}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 6')).toBeTruthy();
    expect(getAllByTestId('matter-option')).toHaveLength(3);
  });

  it('shows a state-change scenario when transformChance is 1', () => {
    const { getByText, getAllByTestId } = render(
      <MatterGame
        params={{ tiers: [1], transformChance: 1 }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={6}
        difficulty={3}
      />,
    );

    expect(getByText('¿En qué estado queda?')).toBeTruthy();
    expect(getAllByTestId('matter-option')).toHaveLength(3);
  });

  it('reports the round and finishes after the last round', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getAllByTestId } = render(
      <MatterGame
        params={{ tiers: [1], transformChance: 0 }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    const buttons = getAllByTestId('matter-option');
    await act(async () => {
      fireEvent.press(buttons[0]);
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('falls back to tier 1 items with no transformations when no params are given', () => {
    const { getByText, getAllByTestId } = render(
      <MatterGame
        params={{}}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={6}
        difficulty={1}
      />,
    );

    expect(getByText('¿Qué estado es...?')).toBeTruthy();
    expect(getAllByTestId('matter-option')).toHaveLength(3);
  });
});
