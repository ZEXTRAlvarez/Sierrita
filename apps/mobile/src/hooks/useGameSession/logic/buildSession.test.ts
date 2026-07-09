import { buildSession } from './buildSession';

describe('buildSession', () => {
  it('starts a session with no rounds played yet', () => {
    const session = buildSession('tracing', 'jungle', 'p1', 1);

    expect(session).toMatchObject({
      gameId: 'tracing',
      world: 'jungle',
      profileId: 'p1',
      difficulty: 1,
      rounds: [],
    });
    expect(session.startedAt).toBeGreaterThan(0);
  });
});
