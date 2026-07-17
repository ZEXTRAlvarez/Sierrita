import type { PetType } from '../../../store/atoms';

export interface PetOption {
  type: PetType;
  label: string;
}

export const PET_OPTIONS: PetOption[] = [
  { type: 'dragon', label: 'Dragoncito' },
  { type: 'bunny', label: 'Conejita' },
  { type: 'dog', label: 'Perrito' },
  { type: 'cat', label: 'Gatito' },
  { type: 'rex', label: 'Rex' },
];

export const AGE_OPTIONS = [4, 5, 6] as const;
