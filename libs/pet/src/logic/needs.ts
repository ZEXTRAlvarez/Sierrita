import type { PetState, PetNeedEvent } from '../types';
import { clamp } from '../utils/clamp';
import { addXp } from './evolution';

export function applyNeedEvent(state: PetState, event: PetNeedEvent): PetState {
  switch (event.type) {
    case 'feed':
      return {
        ...state,
        hunger: clamp(state.hunger + event.amount),
        happiness: clamp(state.happiness + Math.floor(event.amount * 0.2)),
      };
    case 'water':
      return {
        ...state,
        thirst: clamp(state.thirst + event.amount),
        happiness: clamp(state.happiness + Math.floor(event.amount * 0.15)),
      };
    case 'play':
      return {
        ...state,
        happiness: clamp(state.happiness + event.amount),
        hunger: clamp(state.hunger - Math.floor(event.amount * 0.1)),
        thirst: clamp(state.thirst - Math.floor(event.amount * 0.15)),
      };
    case 'reward':
      // XP reward after completing a game
      return addXp(state, event.amount);
    default:
      return state;
  }
}
