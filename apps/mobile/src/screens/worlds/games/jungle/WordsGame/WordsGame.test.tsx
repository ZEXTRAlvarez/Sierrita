import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import WordsGame from './WordsGame';

// Every "random" pick in @sierrita/games' getWords/getBlanks/getLetterOptions
// sorts or samples via Math.random(). Pinning it to a constant makes those
// picks deterministic (comparator always returns 0 -> stable sort is a no-op)
// so the word/blank/options are known ahead of time: word "OSO" (🐻), blank
// at index 0, options ['O', 'N'] with 'O' correct.
describe('WordsGame', () => {
  let randomSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.useRealTimers();
    randomSpy.mockRestore();
  });

  it('shows round progress, the word emoji, and letter options', () => {
    const { getByText, getAllByTestId } = render(
      <WordsGame
        params={{ wordLength: 3, category: 'animals', blanks: 1 }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={1}
        difficulty={1}
      />,
    );

    expect(getByText('🐻')).toBeTruthy();
    expect(getByText('1 / 1')).toBeTruthy();
    expect(getByText('S')).toBeTruthy();
    expect(getAllByTestId('word-letter-option').length).toBeGreaterThan(0);
  });

  it('completes the round and finishes when the correct letter is chosen', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getAllByTestId } = render(
      <WordsGame
        params={{ wordLength: 3, category: 'animals', blanks: 1 }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    await act(async () => {
      fireEvent.press(getAllByTestId('word-letter-option')[0]); // 'O', correct
    });

    expect(onRoundComplete).toHaveBeenCalledWith(true, 0, 0);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('flashes wrong and resets the blank, without advancing, on a wrong letter', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getAllByTestId, getByText, queryByText } = render(
      <WordsGame
        params={{ wordLength: 3, category: 'animals', blanks: 1 }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    await act(async () => {
      fireEvent.press(getAllByTestId('word-letter-option')[1]); // 'N', wrong
    });

    expect(onRoundComplete).toHaveBeenCalledWith(false, 0);
    expect(getByText('¡Casi! Intentá de nuevo 💪')).toBeTruthy();

    act(() => jest.advanceTimersByTime(800));

    expect(queryByText('¡Casi! Intentá de nuevo 💪')).toBeNull();
    expect(onGameFinish).not.toHaveBeenCalled();
  });
});
