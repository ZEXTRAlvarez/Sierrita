import { act, renderHook } from '@testing-library/react-native';
import { useSudokuGameState } from './useSudokuGameState';
import type { Cell, SudokuPuzzle } from '../logic/generatePuzzle';

function requireBlank(current: Cell | null): Cell {
  if (!current) throw new Error('Expected a current blank cell');
  return current;
}

function requirePuzzle(puzzle: SudokuPuzzle | null): SudokuPuzzle {
  if (!puzzle) throw new Error('Expected a generated puzzle');
  return puzzle;
}

describe('useSudokuGameState', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('generates a puzzle with the requested number of blanks on mount', () => {
    const { result } = renderHook(() =>
      useSudokuGameState({
        size: 4,
        boxRows: 2,
        boxCols: 2,
        blankCount: 3,
        onRoundComplete: jest.fn(async () => undefined),
        onGameFinish: jest.fn(),
        roundCount: 3,
      }),
    );

    expect(result.current.puzzle?.blanks).toHaveLength(3);
    expect(result.current.currentBlank).toEqual(
      result.current.puzzle?.blanks[0],
    );
  });

  it('reveals the correct value and advances to the next blank on answer', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { result } = renderHook(() =>
      useSudokuGameState({
        size: 4,
        boxRows: 2,
        boxCols: 2,
        blankCount: 2,
        onRoundComplete,
        onGameFinish,
        roundCount: 2,
      }),
    );

    const firstBlank = requireBlank(result.current.currentBlank);
    const puzzle = requirePuzzle(result.current.puzzle);
    const correctValue = puzzle.solution[firstBlank.row][firstBlank.col];

    await act(async () => {
      result.current.handleChoice(correctValue);
    });

    expect(onRoundComplete).toHaveBeenCalledWith(true, 0, 0);
    expect(result.current.displayGrid[firstBlank.row][firstBlank.col]).toBe(
      correctValue,
    );

    act(() => {
      jest.advanceTimersByTime(900);
    });

    expect(result.current.currentBlank).toEqual(
      result.current.puzzle?.blanks[1],
    );
  });

  it('reports a wrong answer but still reveals the correct value', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const { result } = renderHook(() =>
      useSudokuGameState({
        size: 4,
        boxRows: 2,
        boxCols: 2,
        blankCount: 1,
        onRoundComplete,
        onGameFinish: jest.fn(),
        roundCount: 1,
      }),
    );

    const blank = requireBlank(result.current.currentBlank);
    const puzzle = requirePuzzle(result.current.puzzle);
    const correctValue = puzzle.solution[blank.row][blank.col];
    const wrongValue = (correctValue % 4) + 1; // guaranteed different, still in 1..4

    await act(async () => {
      result.current.handleChoice(wrongValue);
    });

    expect(onRoundComplete).toHaveBeenCalledWith(false, 0, 0);
    expect(result.current.displayGrid[blank.row][blank.col]).toBe(correctValue);
  });

  it('finishes the game after the last blank is answered', async () => {
    const onGameFinish = jest.fn();
    const { result } = renderHook(() =>
      useSudokuGameState({
        size: 4,
        boxRows: 2,
        boxCols: 2,
        blankCount: 1,
        onRoundComplete: jest.fn(async () => undefined),
        onGameFinish,
        roundCount: 1,
      }),
    );

    const blank = requireBlank(result.current.currentBlank);
    const puzzle = requirePuzzle(result.current.puzzle);
    const value = puzzle.solution[blank.row][blank.col];

    await act(async () => {
      result.current.handleChoice(value);
    });
    act(() => {
      jest.advanceTimersByTime(900);
    });

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });
});
