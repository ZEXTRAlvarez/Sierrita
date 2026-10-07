import { generateProblem } from './generateProblem';

describe('generateProblem', () => {
  it('only uses pieces from the requested pool', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem(['pawn', 'rook'], 5);
      expect(['pawn', 'rook']).toContain(p.piece);
    }
  });

  it('keeps the piece position within the board', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem(['queen'], 5);
      expect(p.pos[0]).toBeGreaterThanOrEqual(0);
      expect(p.pos[0]).toBeLessThan(5);
      expect(p.pos[1]).toBeGreaterThanOrEqual(0);
      expect(p.pos[1]).toBeLessThan(5);
    }
  });

  it('never produces a round with zero valid moves', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem(['pawn'], 5);
      expect(p.validMoves.length).toBeGreaterThan(0);
    }
  });

  it('can draw every piece across enough rounds', () => {
    const pieces = new Set(
      Array.from(
        { length: 40 },
        () =>
          generateProblem(
            ['pawn', 'rook', 'bishop', 'knight', 'queen', 'king'],
            5,
          ).piece,
      ),
    );
    expect(pieces.size).toBeGreaterThan(1);
  });
});
