import type { PetState } from '../types';
import { getDefaultPetName } from '../content/petNames.es';

/** Nombre a mostrar: el elegido por el chico, o el nombre por defecto de su especie */
export function getPetDisplayName(state: PetState): string {
  return state.petName?.trim() ? state.petName : getDefaultPetName(state.petType);
}
