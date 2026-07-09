import { createInMemoryAdapter } from './__testing__/inMemoryAdapter';
import { CREATE_TABLES_SQL } from './tables';
import { runMigrations } from './migrationRunner';
import type { SqliteAdapter } from './sqliteAdapter';

async function hasPetNameColumn(db: SqliteAdapter): Promise<boolean> {
  const columns = await db.getAllAsync<{ name: string }>('PRAGMA table_info(pet_state)');
  return columns.some((c) => c.name === 'pet_name');
}

describe('runMigrations', () => {
  it('initializes schema_version and applies migration 001 on a fresh database', async () => {
    const db = await createInMemoryAdapter();
    await db.execAsync(CREATE_TABLES_SQL); // fresh schema already has pet_name

    await runMigrations(db);

    const versionRow = await db.getFirstAsync<{ version: number }>('SELECT version FROM schema_version');
    expect(versionRow?.version).toBe(1);
    expect(await hasPetNameColumn(db)).toBe(true);
  });

  it('adds pet_name to a database created before that column existed', async () => {
    const db = await createInMemoryAdapter();
    await db.execAsync(`
      CREATE TABLE schema_version (version INTEGER NOT NULL);
      CREATE TABLE pet_state (
        profile_id TEXT PRIMARY KEY,
        pet_type   TEXT NOT NULL DEFAULT 'dragon',
        hunger     INTEGER NOT NULL DEFAULT 80
      );
    `);
    expect(await hasPetNameColumn(db)).toBe(false);

    await runMigrations(db);

    expect(await hasPetNameColumn(db)).toBe(true);
  });

  it('is idempotent — running twice does not error or re-apply migrations', async () => {
    const db = await createInMemoryAdapter();
    await db.execAsync(CREATE_TABLES_SQL);

    await runMigrations(db);
    await runMigrations(db);

    const versionRow = await db.getFirstAsync<{ version: number }>('SELECT version FROM schema_version');
    expect(versionRow?.version).toBe(1);
    const allRows = await db.getAllAsync('SELECT * FROM schema_version');
    expect(allRows).toHaveLength(1); // no duplicate version rows inserted
  });
});
