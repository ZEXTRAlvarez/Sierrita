import { setupTestDatabase } from '../schema/__testing__/setupTestDatabase';
import { __setTestDatabase } from '../schema/getDatabase';
import {
  getAllProfiles,
  getProfileById,
  createProfile,
  deleteProfile,
} from './profileRepository';
import type { Profile } from '@sierrita/profiles';

const profile = (overrides: Partial<Profile> = {}): Profile => ({
  id: 'p1',
  name: 'Sofía',
  age: 5,
  avatar: 'dragon',
  createdAt: 1700000000,
  ...overrides,
});

beforeEach(async () => {
  __setTestDatabase(await setupTestDatabase());
});

afterEach(() => {
  __setTestDatabase(null);
});

describe('createProfile / getProfileById', () => {
  it('persists a profile and reads it back', async () => {
    await createProfile(profile());

    await expect(getProfileById('p1')).resolves.toEqual(profile());
  });

  it('returns null for a profile that does not exist', async () => {
    await expect(getProfileById('missing')).resolves.toBeNull();
  });
});

describe('getAllProfiles', () => {
  it('returns profiles ordered by creation time ascending', async () => {
    await createProfile(profile({ id: 'p2', name: 'Second', createdAt: 200 }));
    await createProfile(profile({ id: 'p1', name: 'First', createdAt: 100 }));

    const all = await getAllProfiles();

    expect(all.map((p) => p.id)).toEqual(['p1', 'p2']);
  });

  it('returns an empty array when there are no profiles', async () => {
    await expect(getAllProfiles()).resolves.toEqual([]);
  });
});

describe('deleteProfile', () => {
  it('removes the profile', async () => {
    await createProfile(profile());

    await deleteProfile('p1');

    await expect(getProfileById('p1')).resolves.toBeNull();
  });
});
