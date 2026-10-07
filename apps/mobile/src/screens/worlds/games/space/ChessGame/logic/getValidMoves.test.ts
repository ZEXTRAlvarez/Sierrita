import { getValidMoves } from './getValidMoves';

function sorted(moves: [number, number][]) {
  return [...moves].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

describe('getValidMoves', () => {
  it('moves the pawn one square up when not on the top row', () => {
    expect(getValidMoves('pawn', [2, 2], 5)).toEqual([[1, 2]]);
  });

  it('gives the pawn no moves on the top row', () => {
    expect(getValidMoves('pawn', [0, 2], 5)).toEqual([]);
  });

  it('gives the rook every square in its row and column', () => {
    const moves = sorted(getValidMoves('rook', [2, 2], 5));
    expect(moves).toEqual(
      sorted([
        [0, 2],
        [1, 2],
        [3, 2],
        [4, 2],
        [2, 0],
        [2, 1],
        [2, 3],
        [2, 4],
      ]),
    );
  });

  it('gives the bishop every square on its diagonals', () => {
    const moves = sorted(getValidMoves('bishop', [2, 2], 5));
    expect(moves).toEqual(
      sorted([
        [0, 0],
        [1, 1],
        [3, 3],
        [4, 4],
        [0, 4],
        [1, 3],
        [3, 1],
        [4, 0],
      ]),
    );
  });

  it('gives the queen the union of rook and bishop moves', () => {
    const rook = getValidMoves('rook', [2, 2], 5);
    const bishop = getValidMoves('bishop', [2, 2], 5);
    const queen = getValidMoves('queen', [2, 2], 5);

    expect(sorted(queen)).toEqual(sorted([...rook, ...bishop]));
  });

  it('gives the king up to 8 adjacent squares, clipped at the board edge', () => {
    expect(sorted(getValidMoves('king', [2, 2], 5))).toEqual(
      sorted([
        [1, 1],
        [1, 2],
        [1, 3],
        [2, 1],
        [2, 3],
        [3, 1],
        [3, 2],
        [3, 3],
      ]),
    );
    expect(getValidMoves('king', [0, 0], 5)).toHaveLength(3);
  });

  it('gives the knight its L-shaped jumps, clipped at the board edge', () => {
    expect(sorted(getValidMoves('knight', [2, 2], 5))).toEqual(
      sorted([
        [0, 1],
        [0, 3],
        [1, 0],
        [1, 4],
        [3, 0],
        [3, 4],
        [4, 1],
        [4, 3],
      ]),
    );
    expect(getValidMoves('knight', [0, 0], 5)).toEqual(
      sorted([
        [1, 2],
        [2, 1],
      ]),
    );
  });
});
