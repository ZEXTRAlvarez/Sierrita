import React from 'react';
import { render } from '@testing-library/react-native';
import { ProgramGrid } from './ProgramGrid';
import { generatePuzzle } from '../../logic/generatePuzzle';

describe('ProgramGrid', () => {
  it('renders one cell per grid position', () => {
    const { size, maze, goal } = generatePuzzle(3);
    const { getAllByTestId } = render(
      <ProgramGrid
        maze={maze}
        size={size}
        cellSize={40}
        pos={[0, 0]}
        facing="bottom"
        goal={goal}
      />,
    );

    expect(getAllByTestId('program-cell')).toHaveLength(9);
  });

  it('shows the robot at the given position', () => {
    const { size, maze, goal } = generatePuzzle(3);
    const { getByTestId } = render(
      <ProgramGrid
        maze={maze}
        size={size}
        cellSize={40}
        pos={[1, 1]}
        facing="right"
        goal={goal}
      />,
    );

    expect(getByTestId('program-robot')).toBeTruthy();
  });
});
