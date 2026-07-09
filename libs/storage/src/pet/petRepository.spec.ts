import { setupTestDatabase } from '../schema/__testing__/setupTestDatabase';
import { __setTestDatabase } from '../schema/getDatabase';
import { getPetState, upsertPetState, addXp } from './petRepository';
import type { PetState } from '@sierrita/pet';

const petState = (overrides: Partial<PetState> = {}): PetState => ({
  profileId: 'p1',
  petType: 'dragon',
  petName: null,
  hunger: 80,
  thirst: 80,
  happiness: 80,
  evolutionStage: 0,
  outfitId: null,
  totalXp: 0,
  lastSessionAt: 1700000000,
  ...overrides,
});

beforeEach(async () => {
  __setTestDatabase(await setupTestDatabase());
});

afterEach(() => {
  __setTestDatabase(null);
});

describe('upsertPetState / getPetState', () => {
  it('inserts a new pet state', async () => {
    await upsertPetState(petState());

    await expect(getPetState('p1')).resolves.toEqual(petState());
  });

  it('updates an existing pet state on conflict (same profileId)', async () => {
    await upsertPetState(petState({ hunger: 80 }));

    await upsertPetState(petState({ hunger: 40, petName: 'Chispita' }));

    await expect(getPetState('p1')).resolves.toEqual(
      petState({ hunger: 40, petName: 'Chispita' }),
    );
  });

  it('returns null for a profile with no pet state yet', async () => {
    await expect(getPetState('missing')).resolves.toBeNull();
  });
});

describe('addXp', () => {
  it('increments total_xp in place', async () => {
    await upsertPetState(petState({ totalXp: 100 }));

    await addXp('p1', 25);

    await expect(getPetState('p1')).resolves.toMatchObject({ totalXp: 125 });
  });
});
