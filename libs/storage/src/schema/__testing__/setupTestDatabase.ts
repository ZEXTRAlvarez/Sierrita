import { createInMemoryAdapter } from './inMemoryAdapter';
import { CREATE_TABLES_SQL } from '../tables';
import { runMigrations } from '../migrationRunner';
import type { SqliteAdapter } from '../sqliteAdapter';

/** A fresh, fully-migrated in-memory database — the starting point for every repository test. */
export async function setupTestDatabase(): Promise<SqliteAdapter> {
  const db = await createInMemoryAdapter();
  await db.execAsync(CREATE_TABLES_SQL);
  await runMigrations(db);
  return db;
}
