import type { SqliteAdapter } from './sqliteAdapter';
import { MIGRATIONS } from './migrations';

async function getStoredVersion(db: SqliteAdapter): Promise<number> {
  const row = await db.getFirstAsync<{ version: number }>('SELECT version FROM schema_version LIMIT 1');
  return row?.version ?? 0;
}

async function setStoredVersion(db: SqliteAdapter, version: number): Promise<void> {
  const existing = await db.getFirstAsync<{ version: number }>('SELECT version FROM schema_version LIMIT 1');
  if (existing) {
    await db.runAsync('UPDATE schema_version SET version = ?', [version]);
  } else {
    await db.runAsync('INSERT INTO schema_version (version) VALUES (?)', [version]);
  }
}

/** Applies every migration newer than the stored schema_version, then bumps it. Idempotent. */
export async function runMigrations(db: SqliteAdapter): Promise<void> {
  const currentVersion = await getStoredVersion(db);
  const pending = MIGRATIONS.filter((m) => m.version > currentVersion).sort((a, b) => a.version - b.version);

  for (const migration of pending) {
    await migration.up(db);
  }

  if (pending.length > 0) {
    await setStoredVersion(db, pending[pending.length - 1].version);
  }
}
