/**
 * Minimal surface of expo-sqlite's SQLiteDatabase that repositories depend on.
 * Narrowing to an interface lets tests inject a real-SQL in-memory adapter
 * (sql.js) instead of mocking each repository individually.
 */
export interface SqliteAdapter {
  execAsync(sql: string): Promise<void>;
  runAsync(sql: string, params?: unknown[]): Promise<unknown>;
  getAllAsync<T>(sql: string, params?: unknown[]): Promise<T[]>;
  getFirstAsync<T>(sql: string, params?: unknown[]): Promise<T | null>;
}
