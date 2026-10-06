import type { SqliteAdapter } from '../sqliteAdapter';
import type { Migration } from './migration';

/**
 * Widens profiles.age from CHECK(age BETWEEN 4 AND 6) to BETWEEN 4 AND 10 for
 * installs created before the 7-10 age range existed. SQLite can't ALTER a
 * CHECK constraint, so the table is rebuilt and the rows copied over.
 */
export const MIGRATION_004_WIDEN_PROFILE_AGE_RANGE: Migration = {
  version: 4,
  description: 'widen profiles.age CHECK constraint to allow ages 7-10',
  up: async (db: SqliteAdapter): Promise<void> => {
    const table = await db.getFirstAsync<{ sql: string }>(
      "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'profiles'",
    );
    if (!table || table.sql.includes('BETWEEN 4 AND 10')) return;

    await db.execAsync(`
      PRAGMA foreign_keys = OFF;
      ALTER TABLE profiles RENAME TO profiles_pre_004;
      CREATE TABLE profiles (
        id          TEXT PRIMARY KEY,
        name        TEXT NOT NULL,
        age         INTEGER NOT NULL CHECK(age BETWEEN 4 AND 10),
        avatar      TEXT NOT NULL DEFAULT 'dragon',
        created_at  INTEGER NOT NULL DEFAULT (unixepoch())
      );
      INSERT INTO profiles (id, name, age, avatar, created_at)
        SELECT id, name, age, avatar, created_at FROM profiles_pre_004;
      DROP TABLE profiles_pre_004;
      PRAGMA foreign_keys = ON;
    `);
  },
};
