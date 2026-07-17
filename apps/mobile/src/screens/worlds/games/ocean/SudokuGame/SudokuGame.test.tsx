import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import SudokuGame from './SudokuGame';
import type { GameProps } from '../../../GameScreen';

describe('SudokuGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows round progress, the grid and a palette sized to the grid', () => {
    const { getByText, getByTestId, getAllByTestId } = render(
      <SudokuGame
        params={{ gridSize: 4, boxRows: 2, boxCols: 2 }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={3}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 3')).toBeTruthy();
    expect(getByTestId('sudoku-grid')).toBeTruthy();
    expect(getByTestId('sudoku-current-cell')).toBeTruthy();
    expect(getAllByTestId('sudoku-number-choice')).toHaveLength(4);
  });

  it('scales the palette to a 9x9 grid', () => {
    const { getAllByTestId } = render(
      <SudokuGame
        params={{ gridSize: 9, boxRows: 3, boxCols: 3 }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={3}
      />,
    );

    expect(getAllByTestId('sudoku-number-choice')).toHaveLength(9);
  });

  it('reports the round and finishes the game once roundCount is reached', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getByTestId, getAllByTestId } = render(
      <SudokuGame
        params={{ gridSize: 4, boxRows: 2, boxCols: 2 }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    // Tap every number until we hit the correct one for the highlighted cell
    // — the test only cares that *a* round gets reported and the game ends,
    // not which specific number was correct.
    const buttons = getAllByTestId('sudoku-number-choice');
    await act(async () => {
      fireEvent.press(buttons[0]);
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);
    expect(getByTestId('sudoku-grid')).toBeTruthy();

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('keeps the already-generated puzzle size when the adaptive difficulty bumps mid-session', () => {
    // Regression: the adaptive engine can raise `difficulty` (and therefore
    // `params.gridSize`) between rounds of the same session. The palette
    // must keep matching the grid that was actually generated, not whatever
    // size the *next* difficulty level would use.
    const props: GameProps = {
      params: { gridSize: 6, boxRows: 2, boxCols: 3 },
      onRoundComplete: jest.fn(async () => undefined),
      onGameFinish: jest.fn(),
      roundCount: 5,
      difficulty: 2,
    };
    const { getAllByTestId, rerender } = render(<SudokuGame {...props} />);

    expect(getAllByTestId('sudoku-number-choice')).toHaveLength(6);

    rerender(
      <SudokuGame
        {...props}
        params={{ gridSize: 9, boxRows: 3, boxCols: 3 }}
        difficulty={3}
      />,
    );

    expect(getAllByTestId('sudoku-number-choice')).toHaveLength(6);
  });
});
