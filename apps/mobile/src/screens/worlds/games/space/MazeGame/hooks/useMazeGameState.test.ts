import { renderHook, act } from '@testing-library/react-native';
import { useMazeGameState } from './useMazeGameState';

// 2x2 fully-open maze: right from (0,0), then bottom from (0,1) reaches the goal (1,1).
const mockMaze = [
  [
    { top: true, right: false, bottom: true, left: true },
    { top: true, right: true, bottom: false, left: false },
  ],
  [
    { top: true, right: true, bottom: true, left: true },
    { top: false, right: true, bottom: true, left: true },
  ],
];

jest.mock('../logic/generateMaze', () => ({
  ...jest.requireActual('../logic/generateMaze'),
  generateMaze: jest.fn(() => mockMaze),
}));

describe('useMazeGameState', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('starts at the top-left cell, not finished', () => {
    const { result } = renderHook(() =>
      useMazeGameState({
        gridSize: 2,
        onRoundComplete: jest.fn(async () => undefined),
        onGameFinish: jest.fn(),
      }),
    );

    expect(result.current.pos).toEqual([0, 0]);
    expect(result.current.finished).toBe(false);
  });

  it('ignores a move toward a wall', () => {
    const { result } = renderHook(() =>
      useMazeGameState({
        gridSize: 2,
        onRoundComplete: jest.fn(async () => undefined),
        onGameFinish: jest.fn(),
      }),
    );

    expect(result.current.canMove('left')).toBe(false);

    act(() => {
      result.current.move('left');
    });

    expect(result.current.pos).toEqual([0, 0]);
  });

  it('moves toward an open wall and finishes on reaching the goal cell', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { result } = renderHook(() =>
      useMazeGameState({ gridSize: 2, onRoundComplete, onGameFinish }),
    );

    await act(async () => {
      await result.current.move('right');
    });
    expect(result.current.pos).toEqual([0, 1]);
    expect(result.current.finished).toBe(false);

    await act(async () => {
      await result.current.move('bottom');
    });
    expect(result.current.pos).toEqual([1, 1]);
    expect(result.current.finished).toBe(true);
    expect(onRoundComplete).toHaveBeenCalledWith(true, 0);

    act(() => jest.advanceTimersByTime(800));
    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });
});
