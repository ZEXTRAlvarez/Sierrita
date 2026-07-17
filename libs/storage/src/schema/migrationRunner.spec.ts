import { createInMemoryAdapter } from './__testing__/inMemoryAdapter';
import { CREATE_TABLES_SQL } from './tables';
import { runMigrations } from './migrationRunner';
import type { SqliteAdapter } from './sqliteAdapter';

async function hasPetNameColumn(db: SqliteAdapter): Promise<boolean> {
  const columns = await db.getAllAsync<{ name: string }>(
    'PRAGMA table_info(pet_state)',
  );
  return columns.some((c) => c.name === 'pet_name');
}

async function hasParentConfigPrefsColumns(
  db: SqliteAdapter,
): Promise<boolean> {
  const columns = await db.getAllAsync<{ name: string }>(
    'PRAGMA table_info(parent_config)',
  );
  const names = columns.map((c) => c.name);
  return (
    names.includes('has_seen_walkthrough') &&
    names.includes('font_scale') &&
    names.includes('high_contrast')
  );
}

describe('runMigrations', () => {
  it('initializes schema_version and applies all migrations on a fresh database', async () => {
    const db = await createInMemoryAdapter();
    await db.execAsync(CREATE_TABLES_SQL); // fresh schema already has every column

    await runMigrations(db);

    const versionRow = await db.getFirstAsync<{ version: number }>(
      'SELECT version FROM schema_version',
    );
    expect(versionRow?.version).toBe(2);
    expect(await hasPetNameColumn(db)).toBe(true);
    expect(await hasParentConfigPrefsColumns(db)).toBe(true);
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
      CREATE TABLE parent_config (
        profile_id TEXT PRIMARY KEY
      );
    `);
    expect(await hasPetNameColumn(db)).toBe(false);

    await runMigrations(db);

    expect(await hasPetNameColumn(db)).toBe(true);
  });

  it('adds the walkthrough/font-scale/high-contrast columns to a database created before they existed', async () => {
    const db = await createInMemoryAdapter();
    await db.execAsync(`
      CREATE TABLE schema_version (version INTEGER NOT NULL);
      CREATE TABLE pet_state (
        profile_id TEXT PRIMARY KEY,
        pet_type   TEXT NOT NULL DEFAULT 'dragon',
        pet_name   TEXT,
        hunger     INTEGER NOT NULL DEFAULT 80
      );
      CREATE TABLE parent_config (
        profile_id TEXT PRIMARY KEY
      );
    `);
    expect(await hasParentConfigPrefsColumns(db)).toBe(false);

    await runMigrations(db);

    expect(await hasParentConfigPrefsColumns(db)).toBe(true);
  });

  it('is idempotent — running twice does not error or re-apply migrations', async () => {
    const db = await createInMemoryAdapter();
    await db.execAsync(CREATE_TABLES_SQL);

    await runMigrations(db);
    await runMigrations(db);

    const versionRow = await db.getFirstAsync<{ version: number }>(
      'SELECT version FROM schema_version',
    );
    expect(versionRow?.version).toBe(2);
    const allRows = await db.getAllAsync('SELECT * FROM schema_version');
    expect(allRows).toHaveLength(1); // no duplicate version rows inserted
  });
});
