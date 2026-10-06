import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import MultiplyGame from './MultiplyGame';

describe('MultiplyGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows round progress and 4 answer options', () => {
    const { getByText, getAllByTestId } = render(
      <MultiplyGame
        params={{ maxTable: 5 }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={6}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 6')).toBeTruthy();
    expect(getAllByTestId('multiply-option')).toHaveLength(4);
  });

  it('reports the round and finishes after the last round', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getAllByTestId } = render(
      <MultiplyGame
        params={{ maxTable: 5 }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    const buttons = getAllByTestId('multiply-option');
    await act(async () => {
      fireEvent.press(buttons[0]);
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('falls back to maxTable 5 when no params are given', () => {
    const { getAllByTestId } = render(
      <MultiplyGame
        params={{}}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={6}
        difficulty={1}
      />,
    );

    expect(getAllByTestId('multiply-option')).toHaveLength(4);
  });
});
