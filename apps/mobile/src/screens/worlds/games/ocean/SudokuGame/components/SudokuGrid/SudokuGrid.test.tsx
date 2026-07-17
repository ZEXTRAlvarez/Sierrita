import React from 'react';
import { render } from '@testing-library/react-native';
import { SudokuGrid } from './SudokuGrid';

describe('SudokuGrid', () => {
  it('renders every cell value and highlights the current blank', () => {
    const grid = [
      [1, 2, 0, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1],
    ];

    const { getByTestId, getAllByText } = render(
      <SudokuGrid
        grid={grid}
        size={4}
        boxRows={2}
        boxCols={2}
        currentCell={{ row: 0, col: 2 }}
        filledKeys={new Set()}
      />,
    );

    expect(getByTestId('sudoku-grid')).toBeTruthy();
    expect(getByTestId('sudoku-current-cell')).toBeTruthy();
    expect(getAllByText('4')).toHaveLength(4); // one per matching cell
  });
});
