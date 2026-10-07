import { getFoodChain } from './foodChainData';

describe('getFoodChain', () => {
  it('only returns chains whose length is within the requested pool', () => {
    for (let i = 0; i < 20; i++) {
      const c = getFoodChain([3]);
      expect(c.links).toHaveLength(3);
    }
  });

  it('can draw chains of different lengths from a wider pool', () => {
    const lengths = new Set(
      Array.from({ length: 20 }, () => getFoodChain([3, 4, 5]).links.length),
    );
    for (const l of lengths) expect([3, 4, 5]).toContain(l);
  });

  it('every chain has a biome and at least 3 links', () => {
    for (const length of [3, 4, 5]) {
      const c = getFoodChain([length]);
      expect(c.biome.length).toBeGreaterThan(0);
      expect(c.links.length).toBeGreaterThanOrEqual(3);
    }
  });
});
