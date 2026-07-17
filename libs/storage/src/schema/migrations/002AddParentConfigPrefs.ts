import type { SqliteAdapter } from '../sqliteAdapter';
import type { Migration } from './migration';

/**
 * Adds parent_config.has_seen_walkthrough / font_scale / high_contrast for
 * installs created before they existed in CREATE_TABLES_SQL.
 */
export const MIGRATION_002_ADD_PARENT_CONFIG_PREFS: Migration = {
  version: 2,
  description:
    'add has_seen_walkthrough, font_scale and high_contrast columns to parent_config',
  up: async (db: SqliteAdapter): Promise<void> => {
    const columns = await db.getAllAsync<{ name: string }>(
      'PRAGMA table_info(parent_config)',
    );
    const names = columns.map((c) => c.name);
    if (!names.includes('has_seen_walkthrough')) {
      await db.execAsync(
        'ALTER TABLE parent_config ADD COLUMN has_seen_walkthrough INTEGER NOT NULL DEFAULT 0',
      );
    }
    if (!names.includes('font_scale')) {
      await db.execAsync(
        "ALTER TABLE parent_config ADD COLUMN font_scale TEXT NOT NULL DEFAULT 'normal'",
      );
    }
    if (!names.includes('high_contrast')) {
      await db.execAsync(
        'ALTER TABLE parent_config ADD COLUMN high_contrast INTEGER NOT NULL DEFAULT 0',
      );
    }
  },
};
