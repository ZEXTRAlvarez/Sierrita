export const DB_NAME = 'sierrita.db';

export const CREATE_TABLES_SQL = `
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS profiles (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    age         INTEGER NOT NULL CHECK(age BETWEEN 4 AND 6),
    avatar      TEXT NOT NULL DEFAULT 'dragon',
    created_at  INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS pet_state (
    profile_id      TEXT PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    pet_type        TEXT NOT NULL DEFAULT 'dragon',
    pet_name        TEXT,
    hunger          INTEGER NOT NULL DEFAULT 80 CHECK(hunger BETWEEN 0 AND 100),
    thirst          INTEGER NOT NULL DEFAULT 80 CHECK(thirst BETWEEN 0 AND 100),
    happiness       INTEGER NOT NULL DEFAULT 80 CHECK(happiness BETWEEN 0 AND 100),
    evolution_stage INTEGER NOT NULL DEFAULT 0 CHECK(evolution_stage BETWEEN 0 AND 3),
    outfit_id       TEXT,
    total_xp        INTEGER NOT NULL DEFAULT 0,
    last_session_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS unlocks (
    id          TEXT PRIMARY KEY,
    profile_id  TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type        TEXT NOT NULL CHECK(type IN ('world','outfit','item','achievement')),
    item_id     TEXT NOT NULL,
    unlocked_at INTEGER NOT NULL DEFAULT (unixepoch()),
    UNIQUE(profile_id, type, item_id)
  );

  CREATE TABLE IF NOT EXISTS game_sessions (
    id            TEXT PRIMARY KEY,
    profile_id    TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    world         TEXT NOT NULL CHECK(world IN ('jungle','ocean','space')),
    game_id       TEXT NOT NULL,
    score         INTEGER NOT NULL DEFAULT 0,
    max_score     INTEGER NOT NULL DEFAULT 0,
    duration_secs INTEGER NOT NULL DEFAULT 0,
    difficulty    INTEGER NOT NULL DEFAULT 1 CHECK(difficulty BETWEEN 1 AND 3),
    completed     INTEGER NOT NULL DEFAULT 0 CHECK(completed IN (0,1)),
    played_at     INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS difficulty_state (
    profile_id        TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    game_id           TEXT NOT NULL,
    current_level     INTEGER NOT NULL DEFAULT 1 CHECK(current_level BETWEEN 1 AND 3),
    consecutive_hits  INTEGER NOT NULL DEFAULT 0,
    consecutive_miss  INTEGER NOT NULL DEFAULT 0,
    total_attempts    INTEGER NOT NULL DEFAULT 0,
    total_correct     INTEGER NOT NULL DEFAULT 0,
    updated_at        INTEGER NOT NULL DEFAULT (unixepoch()),
    PRIMARY KEY(profile_id, game_id)
  );

  CREATE TABLE IF NOT EXISTS parent_config (
    profile_id          TEXT PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    pin_hash            TEXT NOT NULL DEFAULT '',
    max_session_minutes INTEGER NOT NULL DEFAULT 30,
    worlds_enabled      TEXT NOT NULL DEFAULT 'jungle,ocean,space',
    updated_at          INTEGER NOT NULL DEFAULT (unixepoch())
  );
`;
