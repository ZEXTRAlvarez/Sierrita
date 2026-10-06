import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import WordClassGame from './WordClassGame';

describe('WordClassGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows round progress, a standalone word and 3 class options', () => {
    const { getByText, getAllByTestId } = render(
      <WordClassGame
        params={{ sentenceChance: 0 }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={6}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 6')).toBeTruthy();
    expect(getAllByTestId('wordclass-option')).toHaveLength(3);
  });

  it('shows the full sentence with the target word when sentenceChance is 1', () => {
    const { getAllByTestId } = render(
      <WordClassGame
        params={{ sentenceChance: 1 }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={6}
        difficulty={3}
      />,
    );

    expect(getAllByTestId('wordclass-option')).toHaveLength(3);
  });

  it('reports the round and finishes after the last round', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getAllByTestId } = render(
      <WordClassGame
        params={{ sentenceChance: 0 }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    const buttons = getAllByTestId('wordclass-option');
    await act(async () => {
      fireEvent.press(buttons[0]);
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('falls back to standalone words when no params are given', () => {
    const { getAllByTestId } = render(
      <WordClassGame
        params={{}}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={6}
        difficulty={1}
      />,
    );

    expect(getAllByTestId('wordclass-option')).toHaveLength(3);
  });
});
