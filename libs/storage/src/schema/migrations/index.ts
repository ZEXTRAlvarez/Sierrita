import type { Migration } from './migration';
import { MIGRATION_001_ADD_PET_NAME } from './001AddPetName';
import { MIGRATION_002_ADD_PARENT_CONFIG_PREFS } from './002AddParentConfigPrefs';

export type { Migration };

/** Ordered by version. Add new migrations here as the schema evolves. */
export const MIGRATIONS: Migration[] = [
  MIGRATION_001_ADD_PET_NAME,
  MIGRATION_002_ADD_PARENT_CONFIG_PREFS,
];
