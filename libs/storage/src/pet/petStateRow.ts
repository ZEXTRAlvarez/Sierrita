import type { PetState } from '@sierrita/pet';

export function rowToPetState(row: Record<string, unknown>): PetState {
  return {
    profileId: row.profile_id as string,
    petType: row.pet_type as PetState['petType'],
    petName: (row.pet_name as string | null) ?? null,
    hunger: row.hunger as number,
    thirst: row.thirst as number,
    happiness: row.happiness as number,
    evolutionStage: row.evolution_stage as PetState['evolutionStage'],
    outfitId: row.outfit_id as string | null,
    totalXp: row.total_xp as number,
    lastSessionAt: row.last_session_at as number,
  };
}
