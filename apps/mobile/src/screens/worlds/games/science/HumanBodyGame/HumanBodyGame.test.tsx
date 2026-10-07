import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import HumanBodyGame from './HumanBodyGame';

describe('HumanBodyGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows round progress, the silhouette and 4 answer options', () => {
    const { getByText, getByTestId, getAllByTestId } = render(
      <HumanBodyGame
        params={{ tiers: [1] }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={6}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 6')).toBeTruthy();
    expect(getByTestId('body-silhouette')).toBeTruthy();
    expect(getAllByTestId('body-option')).toHaveLength(4);
  });

  it('reports the round and finishes after the last round', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getAllByTestId } = render(
      <HumanBodyGame
        params={{ tiers: [1] }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    const buttons = getAllByTestId('body-option');
    await act(async () => {
      fireEvent.press(buttons[0]);
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('falls back to tier 1 when no params are given', () => {
    const { getAllByTestId } = render(
      <HumanBodyGame
        params={{}}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={6}
        difficulty={1}
      />,
    );

    expect(getAllByTestId('body-option')).toHaveLength(4);
  });
});
