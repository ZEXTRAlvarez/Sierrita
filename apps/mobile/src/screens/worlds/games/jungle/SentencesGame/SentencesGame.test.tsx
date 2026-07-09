import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import SentencesGame from './SentencesGame';

// getSentences/shuffleWords lean on Math.random() internally, and shuffleWords
// specifically retries until the shuffled order differs from the original —
// pinning Math.random() to a constant would spin that loop forever. Mocking
// the two functions directly keeps the round fully deterministic instead:
// sentence is always "EL GATO DUERME" (🐱), bank order is always reversed.
jest.mock('@sierrita/games', () => ({
  ...jest.requireActual('@sierrita/games'),
  getSentences: jest.fn(() => [{ words: ['EL', 'GATO', 'DUERME'], emoji: '🐱', category: 'action' }]),
  shuffleWords: jest.fn((words: string[]) => [...words].reverse()),
}));

describe('SentencesGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows the sentence emoji, round progress, and the shuffled word bank', () => {
    const { getByText, getAllByTestId } = render(
      <SentencesGame
        params={{ wordCount: 3 }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={1}
        difficulty={1}
      />,
    );

    expect(getByText('🐱')).toBeTruthy();
    expect(getByText('1 / 1')).toBeTruthy();
    expect(getByText('Tocá las palabras de abajo')).toBeTruthy();
    expect(getAllByTestId('sentence-bank-word').map((n) => n.props.testID)).toHaveLength(3);
  });

  it('completes the round and finishes when the words are placed in the right order', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getByText } = render(
      <SentencesGame
        params={{ wordCount: 3 }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    fireEvent.press(getByText('EL'));
    fireEvent.press(getByText('GATO'));
    await act(async () => {
      fireEvent.press(getByText('DUERME'));
    });

    expect(onRoundComplete).toHaveBeenCalledWith(true, 0, 0);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('flashes wrong and re-shuffles the bank, without advancing, on the wrong order', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getByText, queryByText } = render(
      <SentencesGame
        params={{ wordCount: 3 }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    fireEvent.press(getByText('GATO'));
    fireEvent.press(getByText('EL'));
    await act(async () => {
      fireEvent.press(getByText('DUERME'));
    });

    expect(onRoundComplete).toHaveBeenCalledWith(false, 0);
    expect(getByText('¡Revisa el orden! 🔄')).toBeTruthy();

    act(() => jest.advanceTimersByTime(1000));

    expect(queryByText('¡Revisa el orden! 🔄')).toBeNull();
    expect(getByText('Tocá las palabras de abajo')).toBeTruthy();
    expect(onGameFinish).not.toHaveBeenCalled();
  });
});
