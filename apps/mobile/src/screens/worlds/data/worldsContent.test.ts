import { WORLDS } from './worldsContent';

describe('WORLDS', () => {
  it('has exactly one entry per world', () => {
    expect(WORLDS.map((w) => w.id)).toEqual([
      'jungle',
      'ocean',
      'space',
      'science',
    ]);
  });

  it('gives every world its expected game count', () => {
    const expected: Record<string, number> = {
      jungle: 9,
      ocean: 10,
      space: 8,
      science: 3,
    };
    for (const world of WORLDS) {
      expect(world.games).toHaveLength(expected[world.id]);
    }
  });
});
