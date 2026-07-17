import type { ParentConfig } from '@sierrita/parents';

export function rowToConfig(row: Record<string, unknown>): ParentConfig {
  return {
    profileId: row.profile_id as string,
    pinHash: row.pin_hash as string,
    maxSessionMinutes: row.max_session_minutes as number,
    worldsEnabled: (row.worlds_enabled as string).split(
      ',',
    ) as ParentConfig['worldsEnabled'],
    updatedAt: row.updated_at as number,
    hasSeenWalkthrough: row.has_seen_walkthrough === 1,
    fontScale: row.font_scale as ParentConfig['fontScale'],
    highContrast: row.high_contrast === 1,
  };
}
