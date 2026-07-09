import type { PetType } from '../../../store/atoms';

export interface PetOption {
  type: PetType;
  emoji: string;
  label: string;
}

export const PET_OPTIONS: PetOption[] = [
  { type: 'dragon', emoji: '🐲', label: 'Dragoncito' },
  { type: 'bunny', emoji: '🐰', label: 'Conejita' },
  { type: 'dog', emoji: '🐶', label: 'Perrito' },
  { type: 'cat', emoji: '🐱', label: 'Gatito' },
  { type: 'rex', emoji: '🦖', label: 'Rex' },
];

export const AGE_OPTIONS = [4, 5, 6] as const;
