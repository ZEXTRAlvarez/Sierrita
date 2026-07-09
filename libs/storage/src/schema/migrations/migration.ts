import type { SqliteAdapter } from '../sqliteAdapter';

export interface Migration {
  version: number;
  description: string;
  up: (db: SqliteAdapter) => Promise<void>;
}
