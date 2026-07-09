import { rowToPetState } from './petStateRow';

describe('rowToPetState', () => {
  it('maps a raw SQLite row to a PetState', () => {
    const row = {
      profile_id: 'p1',
      pet_type: 'dragon',
      pet_name: 'Chispita',
      hunger: 70,
      thirst: 65,
      happiness: 80,
      evolution_stage: 1,
      outfit_id: null,
      total_xp: 200,
      last_session_at: 1700000000,
    };

    expect(rowToPetState(row)).toEqual({
      profileId: 'p1',
      petType: 'dragon',
      petName: 'Chispita',
      hunger: 70,
      thirst: 65,
      happiness: 80,
      evolutionStage: 1,
      outfitId: null,
      totalXp: 200,
      lastSessionAt: 1700000000,
    });
  });

  it('defaults a missing pet_name to null', () => {
    const row = {
      profile_id: 'p1',
      pet_type: 'dragon',
      pet_name: undefined,
      hunger: 80,
      thirst: 80,
      happiness: 80,
      evolution_stage: 0,
      outfit_id: null,
      total_xp: 0,
      last_session_at: 0,
    };

    expect(rowToPetState(row).petName).toBeNull();
  });
});
