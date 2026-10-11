import { ALL_GAMES, getGameConfig, getWorldGames } from './gameRegistry';

describe('ALL_GAMES', () => {
  it('registers exactly 32 games across the 4 worlds', () => {
    expect(ALL_GAMES).toHaveLength(32);
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
    'humanBody',
    'foodChain',
    'matter',
    'cycle',
    'floatOrSink',
  ])('resolves the %s game config', (gameId) => {
    expect(getGameConfig(gameId).id).toBe(gameId);
  });

  it('throws for an unknown game id', () => {
    expect(() => getGameConfig('does-not-exist')).toThrow(
      'Game not found: does-not-exist',
    );
  });
});

describe('numeric ceiling by age (familia del 1000)', () => {
  // sums, hundreds, compare, casita and wordProblems are the games whose
  // numeric ceiling depends on the active profile's age: 6+ reaches the
  // family of 1000, while under 6 keeps the original, lower ceiling (never
  // above 300, per the HU's own acceptance criterion).
  it.each([
    ['sums', 'resultMax'],
    ['hundreds', 'maxNumber'],
    ['compare', 'maxNumber'],
    ['wordProblems', 'resultMax'],
  ] as const)('%s.%s reaches 1000 at difficulty 3 for age 6+', (id, key) => {
    const params = getGameConfig(id).params(3, 6) as Record<string, number>;
    expect(params[key]).toBe(1000);
  });

  it('sums never exceeds 300 for a profile under 6', () => {
    for (const d of [1, 2, 3] as const) {
      const params = getGameConfig('sums').params(d, 5) as Record<
        string,
        number
      >;
      expect(params.maxOperand).toBeLessThanOrEqual(300);
      expect(params.resultMax).toBeLessThanOrEqual(300);
    }
  });

  it('compare never exceeds 300 for a profile under 6', () => {
    for (const d of [1, 2, 3] as const) {
      const params = getGameConfig('compare').params(d, 5) as Record<
        string,
        number
      >;
      expect(params.maxNumber).toBeLessThanOrEqual(300);
    }
  });

  it('casita reaches the family of 1000 (resultMax 1000) at difficulty 3 for age 6+', () => {
    const params = getGameConfig('casita').params(3, 6) as Record<
      string,
      number
    >;
    expect(params.resultMax).toBe(1000);
    expect(params.maxOperand).toBe(999);
  });

  it('casita keeps the original, lower ceiling for a profile under 6', () => {
    const params = getGameConfig('casita').params(3, 5) as Record<
      string,
      number
    >;
    expect(params.resultMax).toBe(999);
    expect(params.maxOperand).toBe(899);
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

  it('returns the 5 science games', () => {
    expect(getWorldGames('science')).toHaveLength(5);
  });

  it('returns an empty array for an unknown world', () => {
    expect(getWorldGames('atlantis')).toEqual([]);
  });
});
