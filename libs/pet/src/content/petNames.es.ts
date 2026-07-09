import type { PetType } from '../types';

const DEFAULT_PET_NAMES: Record<PetType, string> = {
  dragon: 'Dragoncito',
  bunny: 'Conejita',
  dog: 'Perrito',
  cat: 'Gatito',
  rex: 'Rex',
};

export function getDefaultPetName(petType: PetType): string {
  return DEFAULT_PET_NAMES[petType] ?? 'Mascota';
}
