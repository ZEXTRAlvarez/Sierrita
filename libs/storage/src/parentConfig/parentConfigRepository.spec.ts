import { setupTestDatabase } from '../schema/__testing__/setupTestDatabase';
import { __setTestDatabase } from '../schema/getDatabase';
import { getParentConfig, upsertParentConfig } from './parentConfigRepository';
import type { ParentConfig } from '@sierrita/parents';

const config = (overrides: Partial<ParentConfig> = {}): ParentConfig => ({
  profileId: 'p1',
  pinHash: '',
  maxSessionMinutes: 30,
  worldsEnabled: ['jungle', 'ocean', 'space'],
  updatedAt: 1700000000,
  ...overrides,
});

beforeEach(async () => {
  __setTestDatabase(await setupTestDatabase());
});

afterEach(() => {
  __setTestDatabase(null);
});

describe('upsertParentConfig / getParentConfig', () => {
  it('inserts a new config', async () => {
    await upsertParentConfig(config());

    await expect(getParentConfig('p1')).resolves.toEqual(config());
  });

  it('updates an existing config on conflict, round-tripping the worldsEnabled CSV', async () => {
    await upsertParentConfig(config());

    await upsertParentConfig(
      config({ pinHash: 'hash123', worldsEnabled: ['ocean'] }),
    );

    await expect(getParentConfig('p1')).resolves.toEqual(
      config({ pinHash: 'hash123', worldsEnabled: ['ocean'] }),
    );
  });

  it('returns null when no config exists for the profile', async () => {
    await expect(getParentConfig('missing')).resolves.toBeNull();
  });
});
