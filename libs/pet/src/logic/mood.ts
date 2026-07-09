import type { PetState, PetMood } from '../types';

export function getMood(state: PetState): PetMood {
  if (state.hunger < 25) return 'hungry';
  if (state.thirst < 25) return 'thirsty';
  if (state.happiness < 35) return 'sad';
  if (state.happiness > 75 && state.hunger > 60 && state.thirst > 60)
    return 'happy';
  return 'neutral';
}
