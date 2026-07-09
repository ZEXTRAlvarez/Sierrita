import type * as ExpoSqlite from 'expo-sqlite';
import type { SqliteAdapter } from './sqliteAdapter';
import { CREATE_TABLES_SQL, DB_NAME } from './tables';
import { runMigrations } from './migrationRunner';

let db: SqliteAdapter | null = null;

export async function getDatabase(): Promise<SqliteAdapter> {
  if (db) return db;
  // Lazy require: keeps the native module out of the import graph for callers
  // (like tests) that only need __setTestDatabase and never actually open a
  // real database.
  const SQLite: typeof ExpoSqlite = require('expo-sqlite');
  // expo-sqlite's SQLiteDatabase satisfies SqliteAdapter structurally at runtime;
  // only its `params` argument typing is narrower (required, not optional), so a
  // single cast isolates that impedance mismatch here instead of widening the
  // adapter interface (which exists precisely to stay narrow for testability).
  const opened = (await SQLite.openDatabaseAsync(DB_NAME)) as unknown as SqliteAdapter;
  await opened.execAsync(CREATE_TABLES_SQL);
  await runMigrations(opened);
  db = opened;
  return db;
}

/** Test-only seam: inject a fake adapter (e.g. an in-memory sql.js database) instead of opening the real native DB. */
export function __setTestDatabase(adapter: SqliteAdapter | null): void {
  db = adapter;
}
