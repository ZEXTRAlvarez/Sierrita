import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import PatternsGame from './PatternsGame';

describe('PatternsGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows round progress and the requested number of choices', () => {
    const { getByText, getAllByTestId } = render(
      <PatternsGame
        params={{ patternLength: 3, attributes: ['color'], choices: 2 }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 5')).toBeTruthy();
    expect(getAllByTestId('pattern-choice')).toHaveLength(2);
  });

  it('reports the round and finishes the game once roundCount is reached', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getAllByTestId } = render(
      <PatternsGame
        params={{ patternLength: 3, attributes: ['color'], choices: 2 }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    const buttons = getAllByTestId('pattern-choice');
    await act(async () => {
      fireEvent.press(buttons[0]);
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });
});
