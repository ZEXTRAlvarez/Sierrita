import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import ClassifyGame from './ClassifyGame';

const fixedRound = {
  categories: [{ label: 'A' }, { label: 'B' }],
  items: [
    { id: 0, emoji: '🍎', categoryIdx: 0 },
    { id: 1, emoji: '🐋', categoryIdx: 1 },
  ],
};

jest.mock('./logic/generateRound', () => ({
  generateRound: jest.fn(() => fixedRound),
}));

describe('ClassifyGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows round progress and one chip per item in the bank', () => {
    const { getByText, getAllByTestId } = render(
      <ClassifyGame
        params={{ categories: 2, attribute: 'color', itemCount: 2 }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={3}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 3')).toBeTruthy();
    expect(getAllByTestId('classify-item')).toHaveLength(2);
  });

  it('finishes the game once every item is classified into its correct bin', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getAllByTestId } = render(
      <ClassifyGame
        params={{ categories: 2, attribute: 'color', itemCount: 2 }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    await act(async () => {
      fireEvent.press(getAllByTestId('classify-item')[0]); // select item 0 (categoryIdx 0)
    });
    await act(async () => {
      fireEvent.press(getAllByTestId('classify-bin')[0]); // correct bin
    });
    await act(async () => {
      fireEvent.press(getAllByTestId('classify-item')[0]); // remaining item is now item 1
    });
    await act(async () => {
      fireEvent.press(getAllByTestId('classify-bin')[1]); // correct bin for item 1
    });

    expect(onRoundComplete).toHaveBeenLastCalledWith(true, 0, 0);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });
});
