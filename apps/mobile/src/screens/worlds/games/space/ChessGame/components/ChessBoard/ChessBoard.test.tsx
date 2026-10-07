import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ChessBoard } from './ChessBoard';

describe('ChessBoard', () => {
  it('renders one square per board position and the piece at its square', () => {
    const { getAllByTestId, getByTestId } = render(
      <ChessBoard
        size={5}
        cellSize={40}
        piecePos={[2, 2]}
        pieceGlyph="♜"
        selected={new Set()}
        onToggleSquare={jest.fn()}
      />,
    );

    expect(getAllByTestId('chess-square')).toHaveLength(25);
    expect(getByTestId('chess-piece')).toBeTruthy();
  });

  it('reports the tapped square position', () => {
    const onToggleSquare = jest.fn();
    const { getAllByTestId } = render(
      <ChessBoard
        size={3}
        cellSize={40}
        piecePos={[0, 0]}
        pieceGlyph="♟"
        selected={new Set()}
        onToggleSquare={onToggleSquare}
      />,
    );

    // 3x3 grid, row-major: index 4 is [1,1]
    fireEvent.press(getAllByTestId('chess-square')[4]);

    expect(onToggleSquare).toHaveBeenCalledWith([1, 1]);
  });

  it('does not report taps when disabled', () => {
    const onToggleSquare = jest.fn();
    const { getAllByTestId } = render(
      <ChessBoard
        size={3}
        cellSize={40}
        piecePos={[0, 0]}
        pieceGlyph="♟"
        selected={new Set()}
        onToggleSquare={onToggleSquare}
        disabled
      />,
    );

    fireEvent.press(getAllByTestId('chess-square')[4]);

    expect(onToggleSquare).not.toHaveBeenCalled();
  });
});
