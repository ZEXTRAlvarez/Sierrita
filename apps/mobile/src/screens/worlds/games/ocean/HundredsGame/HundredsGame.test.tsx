import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import HundredsGame from './HundredsGame';

describe('HundredsGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('renders identify mode with 4 answer options by default', () => {
    const { getAllByTestId, getByText } = render(
      <HundredsGame
        params={{ maxNumber: 99, mode: 'identify' }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 5')).toBeTruthy();
    expect(getAllByTestId('identify-option')).toHaveLength(4);
  });

  it('reports the round and finishes after the last round in compose mode', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getAllByTestId } = render(
      <HundredsGame
        params={{ maxNumber: 500, mode: 'compose' }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    const buttons = getAllByTestId('compose-option');
    await act(async () => {
      fireEvent.press(buttons[0]);
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });
});
