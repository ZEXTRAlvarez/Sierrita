import { rowToConfig } from './parentConfigRow';

describe('rowToConfig', () => {
  it('splits the CSV worlds_enabled column into an array', () => {
    const row = {
      profile_id: 'p1',
      pin_hash: 'abc123',
      max_session_minutes: 30,
      worlds_enabled: 'jungle,ocean,space',
      updated_at: 1700000000,
    };

    expect(rowToConfig(row)).toEqual({
      profileId: 'p1',
      pinHash: 'abc123',
      maxSessionMinutes: 30,
      worldsEnabled: ['jungle', 'ocean', 'space'],
      updatedAt: 1700000000,
    });
  });

  it('handles a single enabled world without a trailing comma', () => {
    const row = {
      profile_id: 'p1',
      pin_hash: '',
      max_session_minutes: 15,
      worlds_enabled: 'jungle',
      updated_at: 0,
    };

    expect(rowToConfig(row).worldsEnabled).toEqual(['jungle']);
  });
});
