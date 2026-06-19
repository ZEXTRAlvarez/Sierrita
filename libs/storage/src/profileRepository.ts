import { getDatabase } from './schema';
import type { Profile, PetType } from '../../profiles/src/types';

function rowToProfile(row: Record<string, unknown>): Profile {
  return {
    id: row.id as string,
    name: row.name as string,
    age: row.age as 4 | 5 | 6,
    avatar: row.avatar as PetType,
    createdAt: row.created_at as number,
  };
}

export async function getAllProfiles(): Promise<Profile[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    'SELECT * FROM profiles ORDER BY created_at ASC',
  );
  return rows.map(rowToProfile);
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM profiles WHERE id = ?',
    [id],
  );
  return row ? rowToProfile(row) : null;
}

export async function createProfile(profile: Profile): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO profiles (id, name, age, avatar, created_at) VALUES (?, ?, ?, ?, ?)',
    [profile.id, profile.name, profile.age, profile.avatar, profile.createdAt],
  );
}

export async function deleteProfile(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM profiles WHERE id = ?', [id]);
}
