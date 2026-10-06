import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import SynonymsGame from './SynonymsGame';

describe('SynonymsGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows round progress, the target word and 4 answer options', () => {
    const { getByText, getAllByTestId } = render(
      <SynonymsGame
        params={{ tiers: [1] }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={6}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 6')).toBeTruthy();
    expect(getAllByTestId('synonym-option')).toHaveLength(4);
  });

  it('reports the round and finishes after the last round', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getAllByTestId } = render(
      <SynonymsGame
        params={{ tiers: [1] }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    const buttons = getAllByTestId('synonym-option');
    await act(async () => {
      fireEvent.press(buttons[0]);
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('falls back to tier 1 when no params are given', () => {
    const { getAllByTestId } = render(
      <SynonymsGame
        params={{}}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={6}
        difficulty={1}
      />,
    );

    expect(getAllByTestId('synonym-option')).toHaveLength(4);
  });
});
