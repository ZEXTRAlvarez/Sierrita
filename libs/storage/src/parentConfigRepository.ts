import { getDatabase } from './schema';
import type { ParentConfig } from '../../parents/src/types';

function rowToConfig(row: Record<string, unknown>): ParentConfig {
  return {
    profileId: row.profile_id as string,
    pinHash: row.pin_hash as string,
    maxSessionMinutes: row.max_session_minutes as number,
    worldsEnabled: (row.worlds_enabled as string).split(',') as ParentConfig['worldsEnabled'],
    updatedAt: row.updated_at as number,
  };
}

export async function getParentConfig(profileId: string): Promise<ParentConfig | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM parent_config WHERE profile_id = ?',
    [profileId],
  );
  return row ? rowToConfig(row) : null;
}

export async function upsertParentConfig(config: ParentConfig): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO parent_config
       (profile_id, pin_hash, max_session_minutes, worlds_enabled, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(profile_id) DO UPDATE SET
       pin_hash            = excluded.pin_hash,
       max_session_minutes = excluded.max_session_minutes,
       worlds_enabled      = excluded.worlds_enabled,
       updated_at          = excluded.updated_at`,
    [
      config.profileId,
      config.pinHash,
      config.maxSessionMinutes,
      config.worldsEnabled.join(','),
      config.updatedAt,
    ],
  );
}
