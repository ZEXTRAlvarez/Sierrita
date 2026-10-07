import { ALL_GAMES, getGameConfig, getWorldGames } from './gameRegistry';

describe('ALL_GAMES', () => {
  it('registers exactly 27 games across the 3 worlds', () => {
    expect(ALL_GAMES).toHaveLength(27);
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
    'wordsh',
    'wordsc',
    'sentences',
    'cursive',
    'reading',
    'synonyms',
    'wordClasses',
    'counting',
    'sums',
    'hundreds',
    'compare',
    'casita',
    'sudoku',
    'multiply',
    'fractions',
    'clock',
    'wordProblems',
    'patterns',
    'memory',
    'classify',
    'maze',
    'oddOneOut',
    'balance',
    'blockCode',
    'chess',
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
  it('returns the 9 jungle games', () => {
    expect(getWorldGames('jungle')).toHaveLength(9);
  });

  it('returns the 10 ocean games', () => {
    expect(getWorldGames('ocean')).toHaveLength(10);
  });

  it('returns the 8 space games', () => {
    expect(getWorldGames('space')).toHaveLength(8);
  });

  it('returns an empty array for an unknown world', () => {
    expect(getWorldGames('atlantis')).toEqual([]);
  });
});
