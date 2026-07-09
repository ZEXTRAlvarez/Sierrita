import type { SqliteAdapter } from '../sqliteAdapter';
import type { Migration } from './migration';

/** Adds pet_state.pet_name for installs created before it existed in CREATE_TABLES_SQL. */
export const MIGRATION_001_ADD_PET_NAME: Migration = {
  version: 1,
  description: 'add pet_name column to pet_state',
  up: async (db: SqliteAdapter): Promise<void> => {
    const columns = await db.getAllAsync<{ name: string }>('PRAGMA table_info(pet_state)');
    const hasPetName = columns.some((c) => c.name === 'pet_name');
    if (!hasPetName) {
      await db.execAsync('ALTER TABLE pet_state ADD COLUMN pet_name TEXT');
    }
  },
};
