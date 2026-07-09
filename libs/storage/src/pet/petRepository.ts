import type { PetState } from '@sierrita/pet';
import { getDatabase } from '../schema/getDatabase';
import { rowToPetState } from './petStateRow';

export async function getPetState(profileId: string): Promise<PetState | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM pet_state WHERE profile_id = ?',
    [profileId],
  );
  return row ? rowToPetState(row) : null;
}

export async function upsertPetState(state: PetState): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO pet_state
       (profile_id, pet_type, pet_name, hunger, thirst, happiness, evolution_stage, outfit_id, total_xp, last_session_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(profile_id) DO UPDATE SET
       pet_type        = excluded.pet_type,
       pet_name        = excluded.pet_name,
       hunger          = excluded.hunger,
       thirst          = excluded.thirst,
       happiness       = excluded.happiness,
       evolution_stage = excluded.evolution_stage,
       outfit_id       = excluded.outfit_id,
       total_xp        = excluded.total_xp,
       last_session_at = excluded.last_session_at`,
    [
      state.profileId,
      state.petType,
      state.petName,
      state.hunger,
      state.thirst,
      state.happiness,
      state.evolutionStage,
      state.outfitId,
      state.totalXp,
      state.lastSessionAt,
    ],
  );
}

export async function addXp(profileId: string, xp: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE pet_state SET total_xp = total_xp + ? WHERE profile_id = ?',
    [xp, profileId],
  );
}
