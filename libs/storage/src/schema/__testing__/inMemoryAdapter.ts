import initSqlJs from 'sql.js';
import type { SqliteAdapter } from '../sqliteAdapter';

/**
 * A real-SQL, in-memory test double backed by sql.js (SQLite compiled to
 * WASM). Exercises actual constraints/migrations instead of mocking the
 * database away — see the storage-lib test plan.
 */
export async function createInMemoryAdapter(): Promise<SqliteAdapter> {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  return {
    async execAsync(sql) {
      db.run(sql);
    },
    async runAsync(sql, params = []) {
      db.run(sql, params as (string | number | null)[]);
      return undefined;
    },
    async getAllAsync<T>(sql: string, params: unknown[] = []) {
      const stmt = db.prepare(sql);
      stmt.bind(params as (string | number | null)[]);
      const results: T[] = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject() as T);
      }
      stmt.free();
      return results;
    },
    async getFirstAsync<T>(sql: string, params: unknown[] = []) {
      const stmt = db.prepare(sql);
      stmt.bind(params as (string | number | null)[]);
      const found = stmt.step();
      const result = found ? (stmt.getAsObject() as T) : null;
      stmt.free();
      return result;
    },
  };
}
