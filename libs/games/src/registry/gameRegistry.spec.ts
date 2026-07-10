import { ALL_GAMES, getGameConfig, getWorldGames } from './gameRegistry';

describe('ALL_GAMES', () => {
  it('registers exactly 13 games across the 3 worlds', () => {
    expect(ALL_GAMES).toHaveLength(13);
  });

  it('has unique game ids', () => {
    const ids = ALL_GAMES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('getGameConfig', () => {
  it.each([
    'tracing',
    'words',
    'sentences',
    'cursive',
    'counting',
    'sums',
    'hundreds',
    'compare',
    'casita',
    'patterns',
    'memory',
    'classify',
    'maze',
  ])('resolves the %s game config', (gameId) => {
    expect(getGameConfig(gameId).id).toBe(gameId);
  });

  it('throws for an unknown game id', () => {
    expect(() => getGameConfig('does-not-exist')).toThrow(
      'Game not found: does-not-exist',
    );
  });
});

describe('getWorldGames', () => {
  it('returns the 4 jungle games', () => {
    expect(getWorldGames('jungle')).toHaveLength(4);
  });

  it('returns the 5 ocean games', () => {
    expect(getWorldGames('ocean')).toHaveLength(5);
  });

  it('returns the 4 space games', () => {
    expect(getWorldGames('space')).toHaveLength(4);
  });

  it('returns an empty array for an unknown world', () => {
    expect(getWorldGames('atlantis')).toEqual([]);
  });
});
