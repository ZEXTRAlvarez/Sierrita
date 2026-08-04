import type { SqliteAdapter } from '../sqliteAdapter';
import type { Migration } from './migration';

/**
 * Adds parent_config.voice_enabled for installs created before it existed in
 * CREATE_TABLES_SQL. Defaults to 1 so existing profiles keep the narration on.
 */
export const MIGRATION_003_ADD_PARENT_CONFIG_VOICE_ENABLED: Migration = {
  version: 3,
  description: 'add voice_enabled column to parent_config',
  up: async (db: SqliteAdapter): Promise<void> => {
    const columns = await db.getAllAsync<{ name: string }>(
      'PRAGMA table_info(parent_config)',
    );
    if (!columns.some((c) => c.name === 'voice_enabled')) {
      await db.execAsync(
        'ALTER TABLE parent_config ADD COLUMN voice_enabled INTEGER NOT NULL DEFAULT 1',
      );
    }
  },
};
