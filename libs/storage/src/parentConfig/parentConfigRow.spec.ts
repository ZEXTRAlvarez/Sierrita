import { rowToConfig } from './parentConfigRow';

describe('rowToConfig', () => {
  it('splits the CSV worlds_enabled column into an array', () => {
    const row = {
      profile_id: 'p1',
      pin_hash: 'abc123',
      max_session_minutes: 30,
      worlds_enabled: 'jungle,ocean,space',
      updated_at: 1700000000,
      has_seen_walkthrough: 1,
      font_scale: 'large',
      high_contrast: 0,
    };

    expect(rowToConfig(row)).toEqual({
      profileId: 'p1',
      pinHash: 'abc123',
      maxSessionMinutes: 30,
      worldsEnabled: ['jungle', 'ocean', 'space'],
      updatedAt: 1700000000,
      hasSeenWalkthrough: true,
      fontScale: 'large',
      highContrast: false,
    });
  });

  it('handles a single enabled world without a trailing comma', () => {
    const row = {
      profile_id: 'p1',
      pin_hash: '',
      max_session_minutes: 15,
      worlds_enabled: 'jungle',
      updated_at: 0,
      has_seen_walkthrough: 0,
      font_scale: 'normal',
      high_contrast: 1,
    };

    expect(rowToConfig(row).worldsEnabled).toEqual(['jungle']);
  });

  it('maps has_seen_walkthrough and high_contrast integer flags to booleans', () => {
    const row = {
      profile_id: 'p1',
      pin_hash: '',
      max_session_minutes: 30,
      worlds_enabled: 'jungle',
      updated_at: 0,
      has_seen_walkthrough: 0,
      font_scale: 'normal',
      high_contrast: 1,
    };

    const config = rowToConfig(row);
    expect(config.hasSeenWalkthrough).toBe(false);
    expect(config.highContrast).toBe(true);
  });
});
