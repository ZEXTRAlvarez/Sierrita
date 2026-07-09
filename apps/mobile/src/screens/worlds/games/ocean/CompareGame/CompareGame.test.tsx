import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import CompareGame from './CompareGame';

describe('CompareGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows round progress and the three comparison symbols', () => {
    const { getByText } = render(
      <CompareGame
        params={{ maxNumber: 20, mode: 'number' }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 5')).toBeTruthy();
    expect(getByText('>')).toBeTruthy();
    expect(getByText('<')).toBeTruthy();
    expect(getByText('=')).toBeTruthy();
  });

  it('reports the round and finishes after the last round', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getByText } = render(
      <CompareGame
        params={{ maxNumber: 20, mode: 'number' }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    await act(async () => {
      fireEvent.press(getByText('>'));
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });
});
