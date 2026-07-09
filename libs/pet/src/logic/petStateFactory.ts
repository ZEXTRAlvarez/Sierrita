import type { PetState, PetType } from '../types';

export function createInitialPetState(
  profileId: string,
  petType: PetType,
): PetState {
  return {
    profileId,
    petType,
    petName: null,
    hunger: 80,
    thirst: 80,
    happiness: 80,
    evolutionStage: 0,
    outfitId: null,
    totalXp: 0,
    lastSessionAt: Math.floor(Date.now() / 1000),
  };
}
