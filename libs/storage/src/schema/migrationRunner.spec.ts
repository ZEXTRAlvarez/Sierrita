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

async function hasVoiceEnabledColumn(db: SqliteAdapter): Promise<boolean> {
  const columns = await db.getAllAsync<{ name: string }>(
    'PRAGMA table_info(parent_config)',
  );
  return columns.some((c) => c.name === 'voice_enabled');
}

async function hasWidenedProfileAgeRange(db: SqliteAdapter): Promise<boolean> {
  const row = await db.getFirstAsync<{ sql: string }>(
    "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'profiles'",
  );
  return row?.sql.includes('BETWEEN 4 AND 10') ?? false;
}

async function hasWidenedGameSessionsCheck(
  db: SqliteAdapter,
): Promise<boolean> {
  const row = await db.getFirstAsync<{ sql: string }>(
    "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'game_sessions'",
  );
  return row?.sql.includes("'science'") ?? false;
}

describe('runMigrations', () => {
  it('initializes schema_version and applies all migrations on a fresh database', async () => {
    const db = await createInMemoryAdapter();
    await db.execAsync(CREATE_TABLES_SQL); // fresh schema already has every column

    await runMigrations(db);

    const versionRow = await db.getFirstAsync<{ version: number }>(
      'SELECT version FROM schema_version',
    );
    expect(versionRow?.version).toBe(5);
    expect(await hasPetNameColumn(db)).toBe(true);
    expect(await hasParentConfigPrefsColumns(db)).toBe(true);
    expect(await hasVoiceEnabledColumn(db)).toBe(true);
    expect(await hasWidenedProfileAgeRange(db)).toBe(true);
    expect(await hasWidenedGameSessionsCheck(db)).toBe(true);
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

  it('leaves the narration on when adding voice_enabled to an existing install', async () => {
    const db = await createInMemoryAdapter();
    await db.execAsync(`
      CREATE TABLE schema_version (version INTEGER NOT NULL);
      CREATE TABLE pet_state (
        profile_id TEXT PRIMARY KEY,
        pet_name   TEXT
      );
      CREATE TABLE parent_config (
        profile_id TEXT PRIMARY KEY
      );
      INSERT INTO parent_config (profile_id) VALUES ('p1');
    `);
    expect(await hasVoiceEnabledColumn(db)).toBe(false);

    await runMigrations(db);

    const row = await db.getFirstAsync<{ voice_enabled: number }>(
      'SELECT voice_enabled FROM parent_config WHERE profile_id = ?',
      ['p1'],
    );
    expect(row?.voice_enabled).toBe(1);
  });

  it('is idempotent — running twice does not error or re-apply migrations', async () => {
    const db = await createInMemoryAdapter();
    await db.execAsync(CREATE_TABLES_SQL);

    await runMigrations(db);
    await runMigrations(db);

    const versionRow = await db.getFirstAsync<{ version: number }>(
      'SELECT version FROM schema_version',
    );
    expect(versionRow?.version).toBe(5);
    const allRows = await db.getAllAsync('SELECT * FROM schema_version');
    expect(allRows).toHaveLength(1); // no duplicate version rows inserted
  });

  it('widens profiles.age to allow 7-10 for a database created before that range existed, keeping existing rows', async () => {
    const db = await createInMemoryAdapter();
    await db.execAsync(`
      CREATE TABLE schema_version (version INTEGER NOT NULL);
      CREATE TABLE profiles (
        id          TEXT PRIMARY KEY,
        name        TEXT NOT NULL,
        age         INTEGER NOT NULL CHECK(age BETWEEN 4 AND 6),
        avatar      TEXT NOT NULL DEFAULT 'dragon',
        created_at  INTEGER NOT NULL DEFAULT (unixepoch())
      );
      CREATE TABLE pet_state (
        profile_id TEXT PRIMARY KEY,
        pet_type   TEXT NOT NULL DEFAULT 'dragon',
        pet_name   TEXT
      );
      CREATE TABLE parent_config (
        profile_id TEXT PRIMARY KEY
      );
      INSERT INTO profiles (id, name, age) VALUES ('p1', 'Sofía', 5);
    `);
    expect(await hasWidenedProfileAgeRange(db)).toBe(false);

    await runMigrations(db);

    expect(await hasWidenedProfileAgeRange(db)).toBe(true);
    const existing = await db.getFirstAsync<{ name: string; age: number }>(
      'SELECT name, age FROM profiles WHERE id = ?',
      ['p1'],
    );
    expect(existing).toEqual({ name: 'Sofía', age: 5 });

    await db.runAsync('INSERT INTO profiles (id, name, age) VALUES (?, ?, ?)', [
      'p2',
      'Mateo',
      8,
    ]);
    const added = await db.getFirstAsync<{ age: number }>(
      'SELECT age FROM profiles WHERE id = ?',
      ['p2'],
    );
    expect(added?.age).toBe(8);
  });

  it('adds the science world for a database created before it existed: widens game_sessions.world and retroactively enables it for existing profiles', async () => {
    const db = await createInMemoryAdapter();
    await db.execAsync(`
      CREATE TABLE schema_version (version INTEGER NOT NULL);
      CREATE TABLE profiles (
        id  TEXT PRIMARY KEY,
        age INTEGER NOT NULL CHECK(age BETWEEN 4 AND 10)
      );
      CREATE TABLE pet_state (
        profile_id TEXT PRIMARY KEY,
        pet_name   TEXT
      );
      CREATE TABLE parent_config (
        profile_id     TEXT PRIMARY KEY,
        worlds_enabled TEXT NOT NULL DEFAULT 'jungle,ocean,space'
      );
      CREATE TABLE game_sessions (
        id            TEXT PRIMARY KEY,
        profile_id    TEXT NOT NULL,
        world         TEXT NOT NULL CHECK(world IN ('jungle','ocean','space')),
        game_id       TEXT NOT NULL,
        score         INTEGER NOT NULL DEFAULT 0,
        max_score     INTEGER NOT NULL DEFAULT 0,
        duration_secs INTEGER NOT NULL DEFAULT 0,
        difficulty    INTEGER NOT NULL DEFAULT 1,
        completed     INTEGER NOT NULL DEFAULT 0,
        played_at     INTEGER NOT NULL DEFAULT (unixepoch())
      );
      INSERT INTO profiles (id, age) VALUES ('p1', 8);
      INSERT INTO parent_config (profile_id, worlds_enabled)
        VALUES ('p1', 'jungle,ocean,space');
      INSERT INTO game_sessions (id, profile_id, world, game_id)
        VALUES ('s1', 'p1', 'ocean', 'sums');
    `);
    expect(await hasWidenedGameSessionsCheck(db)).toBe(false);

    await runMigrations(db);

    expect(await hasWidenedGameSessionsCheck(db)).toBe(true);

    const existingSession = await db.getFirstAsync<{ world: string }>(
      'SELECT world FROM game_sessions WHERE id = ?',
      ['s1'],
    );
    expect(existingSession).toEqual({ world: 'ocean' });

    await db.runAsync(
      'INSERT INTO game_sessions (id, profile_id, world, game_id) VALUES (?, ?, ?, ?)',
      ['s2', 'p1', 'science', 'body'],
    );
    const newSession = await db.getFirstAsync<{ world: string }>(
      'SELECT world FROM game_sessions WHERE id = ?',
      ['s2'],
    );
    expect(newSession?.world).toBe('science');

    const config = await db.getFirstAsync<{ worlds_enabled: string }>(
      'SELECT worlds_enabled FROM parent_config WHERE profile_id = ?',
      ['p1'],
    );
    expect(config?.worlds_enabled).toBe('jungle,ocean,space,science');
  });
});
