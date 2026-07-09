import type { PetState } from '../types';
import { DECAY_RATES } from '../types';
import { clamp } from '../utils/clamp';

/** Decays needs based on elapsed session time in minutes. Session-only — no real-time clock. */
export function applySessionDecay(state: PetState, elapsedMinutes: number): PetState {
  return {
    ...state,
    hunger: clamp(state.hunger - DECAY_RATES.hungerPerMinute * elapsedMinutes),
    thirst: clamp(state.thirst - DECAY_RATES.thirstPerMinute * elapsedMinutes),
    happiness: clamp(state.happiness - DECAY_RATES.happinessPerMinute * elapsedMinutes),
  };
}
