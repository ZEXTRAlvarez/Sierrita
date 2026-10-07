export type PieceType =
  | 'pawn'
  | 'rook'
  | 'bishop'
  | 'knight'
  | 'queen'
  | 'king';

type Pos = [number, number];

function inBounds(pos: Pos, size: number): boolean {
  const [r, c] = pos;
  return r >= 0 && r < size && c >= 0 && c < size;
}

/** Every square reachable sliding along `dirs` until the board edge (no blocking pieces on an otherwise empty board). */
function slide(pos: Pos, dirs: Pos[], size: number): Pos[] {
  const [r, c] = pos;
  const moves: Pos[] = [];
  for (const [dr, dc] of dirs) {
    let nr = r + dr;
    let nc = c + dc;
    while (inBounds([nr, nc], size)) {
      moves.push([nr, nc]);
      nr += dr;
      nc += dc;
    }
  }
  return moves;
}

const ROOK_DIRS: Pos[] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];
const BISHOP_DIRS: Pos[] = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];
const KNIGHT_OFFSETS: Pos[] = [
  [-2, -1],
  [-2, 1],
  [-1, -2],
  [-1, 2],
  [1, -2],
  [1, 2],
  [2, -1],
  [2, 1],
];
const KING_OFFSETS: Pos[] = [...ROOK_DIRS, ...BISHOP_DIRS];

/**
 * Valid destination squares for `piece` at `pos` on an empty `size`×`size`
 * board — no other pieces, so no blocking and no captures. The pawn always
 * moves one square "up" (toward row 0); this is a teaching puzzle, not a
 * real game, so there's no second player or board side to orient against.
 */
export function getValidMoves(piece: PieceType, pos: Pos, size: number): Pos[] {
  const [r, c] = pos;
  switch (piece) {
    case 'rook':
      return slide(pos, ROOK_DIRS, size);
    case 'bishop':
      return slide(pos, BISHOP_DIRS, size);
    case 'queen':
      return slide(pos, [...ROOK_DIRS, ...BISHOP_DIRS], size);
    case 'king':
      return KING_OFFSETS.map(([dr, dc]): Pos => [r + dr, c + dc]).filter((p) =>
        inBounds(p, size),
      );
    case 'knight':
      return KNIGHT_OFFSETS.map(([dr, dc]): Pos => [r + dr, c + dc]).filter(
        (p) => inBounds(p, size),
      );
    case 'pawn': {
      const forward: Pos = [r - 1, c];
      return inBounds(forward, size) ? [forward] : [];
    }
  }
}
