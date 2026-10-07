import { rand } from '../../../shared/rand';
import { getValidMoves, type PieceType } from './getValidMoves';

export interface Problem {
  piece: PieceType;
  pos: [number, number];
  validMoves: [number, number][];
  boardSize: number;
}

/**
 * Builds a round: a random piece from the allowed pool, at a random square
 * on an empty board, with its valid destination squares. Retries if the
 * square happens to leave the piece with zero moves (e.g. a pawn on the top
 * row) — a round with nothing to mark isn't a fair one.
 */
export function generateProblem(
  pieces: PieceType[],
  boardSize: number,
): Problem {
  let piece: PieceType;
  let pos: [number, number];
  let validMoves: [number, number][];
  let tries = 0;
  do {
    tries++;
    piece = pieces[rand(0, pieces.length - 1)];
    pos = [rand(0, boardSize - 1), rand(0, boardSize - 1)];
    validMoves = getValidMoves(piece, pos, boardSize);
  } while (validMoves.length === 0 && tries < 20);

  return { piece, pos, validMoves, boardSize };
}
