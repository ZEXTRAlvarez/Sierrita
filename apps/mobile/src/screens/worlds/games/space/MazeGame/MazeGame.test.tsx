import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import MazeGame from './MazeGame';

// 2x2 fully-open maze: right from (0,0), then bottom from (0,1) reaches the goal (1,1).
const mockMaze = [
  [{ top: true, right: false, bottom: true, left: true }, { top: true, right: true, bottom: false, left: false }],
  [{ top: true, right: true, bottom: true, left: true }, { top: false, right: true, bottom: true, left: true }],
];

jest.mock('./logic/generateMaze', () => ({
  ...jest.requireActual('./logic/generateMaze'),
  generateMaze: jest.fn(() => mockMaze),
}));

describe('MazeGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('renders the instruction and direction controls', () => {
    const { getByText, getByTestId } = render(
      <MazeGame
        params={{ gridSize: 2 }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={1}
        difficulty={1}
      />,
    );

    expect(getByText('Guiá 🚀 hasta ⭐')).toBeTruthy();
    expect(getByTestId('maze-dir-right')).toBeTruthy();
  });

  it('finishes and calls onGameFinish once the rocket reaches the goal', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getByTestId, queryByTestId } = render(
      <MazeGame
        params={{ gridSize: 2 }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    await act(async () => {
      fireEvent.press(getByTestId('maze-dir-right'));
    });
    await act(async () => {
      fireEvent.press(getByTestId('maze-dir-bottom'));
    });

    expect(onRoundComplete).toHaveBeenCalledWith(true, 0);
    expect(queryByTestId('maze-dir-right')).toBeNull();

    act(() => jest.advanceTimersByTime(800));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });
});
