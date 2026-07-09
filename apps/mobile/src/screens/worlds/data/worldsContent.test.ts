import { WORLDS } from './worldsContent';

describe('WORLDS', () => {
  it('has exactly one entry per world', () => {
    expect(WORLDS.map((w) => w.id)).toEqual(['jungle', 'ocean', 'space']);
  });

  it('gives every world exactly 4 games', () => {
    for (const world of WORLDS) {
      expect(world.games).toHaveLength(4);
    }
  });
});
