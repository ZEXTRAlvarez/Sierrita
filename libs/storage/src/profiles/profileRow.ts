import type { Profile, PetType } from '@sierrita/profiles';

export function rowToProfile(row: Record<string, unknown>): Profile {
  return {
    id: row.id as string,
    name: row.name as string,
    age: row.age as 4 | 5 | 6 | 7 | 8 | 9 | 10,
    avatar: row.avatar as PetType,
    createdAt: row.created_at as number,
  };
}
