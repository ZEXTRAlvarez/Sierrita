import type { SqliteAdapter } from '../sqliteAdapter';
import type { Migration } from './migration';

async function tableExists(db: SqliteAdapter, name: string): Promise<boolean> {
  const row = await db.getFirstAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
    [name],
  );
  return !!row;
}

async function widenGameSessionsCheck(db: SqliteAdapter): Promise<void> {
  if (!(await tableExists(db, 'game_sessions'))) return;
  const table = await db.getFirstAsync<{ sql: string }>(
    "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'game_sessions'",
  );
  if (!table || table.sql.includes("'science'")) return;

  await db.execAsync(`
    PRAGMA foreign_keys = OFF;
    ALTER TABLE game_sessions RENAME TO game_sessions_pre_005;
    CREATE TABLE game_sessions (
      id            TEXT PRIMARY KEY,
      profile_id    TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      world         TEXT NOT NULL CHECK(world IN ('jungle','ocean','space','science')),
      game_id       TEXT NOT NULL,
      score         INTEGER NOT NULL DEFAULT 0,
      max_score     INTEGER NOT NULL DEFAULT 0,
      duration_secs INTEGER NOT NULL DEFAULT 0,
      difficulty    INTEGER NOT NULL DEFAULT 1 CHECK(difficulty BETWEEN 1 AND 3),
      completed     INTEGER NOT NULL DEFAULT 0 CHECK(completed IN (0,1)),
      played_at     INTEGER NOT NULL DEFAULT (unixepoch())
    );
    INSERT INTO game_sessions (
      id, profile_id, world, game_id, score, max_score, duration_secs,
      difficulty, completed, played_at
    )
      SELECT id, profile_id, world, game_id, score, max_score, duration_secs,
             difficulty, completed, played_at
      FROM game_sessions_pre_005;
    DROP TABLE game_sessions_pre_005;
    PRAGMA foreign_keys = ON;
  `);
}

async function enableScienceForExistingProfiles(
  db: SqliteAdapter,
): Promise<void> {
  if (!(await tableExists(db, 'parent_config'))) return;
  const columns = await db.getAllAsync<{ name: string }>(
    'PRAGMA table_info(parent_config)',
  );
  if (!columns.some((c) => c.name === 'worlds_enabled')) return;

  await db.execAsync(`
    UPDATE parent_config
    SET worlds_enabled = worlds_enabled || ',science'
    WHERE worlds_enabled NOT LIKE '%science%';
  `);
}

/**
 * Adds the Laboratorio Curioso ('science') world for installs created before
 * it existed: widens game_sessions.world's CHECK constraint (SQLite can't
 * ALTER a CHECK, so the table is rebuilt — same approach as migration 004),
 * and retroactively enables the world for profiles that already have a
 * parent_config row, so it shows up for them too instead of only new
 * profiles (which already get it from createDefaultParentConfig).
 */
export const MIGRATION_005_ADD_SCIENCE_WORLD: Migration = {
  version: 5,
  description: "add the 'science' world (Laboratorio Curioso)",
  up: async (db: SqliteAdapter): Promise<void> => {
    await widenGameSessionsCheck(db);
    await enableScienceForExistingProfiles(db);
  },
};
