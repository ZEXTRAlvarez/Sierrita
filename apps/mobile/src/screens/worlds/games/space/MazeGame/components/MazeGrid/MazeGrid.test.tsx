import React from 'react';
import { render } from '@testing-library/react-native';
import { MazeGrid } from './MazeGrid';

const maze = [
  [{ top: true, right: false, bottom: true, left: true }, { top: true, right: true, bottom: true, left: false }],
  [{ top: true, right: false, bottom: true, left: true }, { top: true, right: true, bottom: true, left: false }],
];

describe('MazeGrid', () => {
  it('renders the rocket at the current position and the star at the goal', () => {
    const { getByText } = render(<MazeGrid maze={maze} gridSize={2} cellSize={40} pos={[0, 0]} />);

    expect(getByText('🚀')).toBeTruthy();
    expect(getByText('⭐')).toBeTruthy();
  });

  it('hides the star once the rocket reaches the goal cell', () => {
    const { getByText, queryByText } = render(<MazeGrid maze={maze} gridSize={2} cellSize={40} pos={[1, 1]} />);

    expect(getByText('🚀')).toBeTruthy();
    expect(queryByText('⭐')).toBeNull();
  });
});
