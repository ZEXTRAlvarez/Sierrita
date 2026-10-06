import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import ReadingGame from './ReadingGame';

describe('ReadingGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows the story first, with a listen-again and a continue button, and no options yet', () => {
    const { getByText, getByTestId, queryAllByTestId } = render(
      <ReadingGame
        params={{ lengthPool: ['short'], kinds: ['literal'] }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 5')).toBeTruthy();
    expect(getByTestId('reading-listen-again')).toBeTruthy();
    expect(getByTestId('reading-continue')).toBeTruthy();
    expect(queryAllByTestId('reading-option')).toHaveLength(0);
  });

  it('moves to the question after pressing continue', () => {
    const { getByTestId, getAllByTestId } = render(
      <ReadingGame
        params={{ lengthPool: ['short'], kinds: ['literal'] }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    fireEvent.press(getByTestId('reading-continue'));

    expect(getAllByTestId('reading-option').length).toBeGreaterThan(0);
  });

  it('reports the round and finishes after the last round', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getByTestId, getAllByTestId } = render(
      <ReadingGame
        params={{ lengthPool: ['short'], kinds: ['literal'] }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    fireEvent.press(getByTestId('reading-continue'));
    const options = getAllByTestId('reading-option');
    await act(async () => {
      fireEvent.press(options[0]);
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('falls back to a short literal story when no params are given', () => {
    const { getByText } = render(
      <ReadingGame
        params={{}}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 5')).toBeTruthy();
  });
});
