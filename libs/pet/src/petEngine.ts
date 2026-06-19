import type { PetState, PetMood, PetNeedEvent, EvolutionStage } from './types';
import { DECAY_RATES, XP_THRESHOLDS } from './types';
import type { PetType } from '../../profiles/src/types';

export function createInitialPetState(profileId: string, petType: PetType): PetState {
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

/** Decays needs based on elapsed session time in minutes. Session-only — no real-time clock. */
export function applySessionDecay(state: PetState, elapsedMinutes: number): PetState {
  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  return {
    ...state,
    hunger: clamp(state.hunger - DECAY_RATES.hungerPerMinute * elapsedMinutes),
    thirst: clamp(state.thirst - DECAY_RATES.thirstPerMinute * elapsedMinutes),
    happiness: clamp(state.happiness - DECAY_RATES.happinessPerMinute * elapsedMinutes),
  };
}

export function applyNeedEvent(state: PetState, event: PetNeedEvent): PetState {
  const clamp = (v: number) => Math.max(0, Math.min(100, v));
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

export function addXp(state: PetState, xp: number): PetState {
  const newTotal = state.totalXp + xp;
  const newStage = computeEvolutionStage(newTotal);
  return {
    ...state,
    totalXp: newTotal,
    evolutionStage: newStage,
    happiness: newStage > state.evolutionStage
      ? Math.min(100, state.happiness + 30)  // burst of happiness on evolution
      : state.happiness,
  };
}

function computeEvolutionStage(totalXp: number): EvolutionStage {
  if (totalXp >= XP_THRESHOLDS[3]) return 3;
  if (totalXp >= XP_THRESHOLDS[2]) return 2;
  if (totalXp >= XP_THRESHOLDS[1]) return 1;
  return 0;
}

export function getMood(state: PetState): PetMood {
  if (state.hunger < 25) return 'hungry';
  if (state.thirst < 25) return 'thirsty';
  if (state.happiness < 35) return 'sad';
  if (state.happiness > 75 && state.hunger > 60 && state.thirst > 60) return 'happy';
  return 'neutral';
}

export function getEvolutionLabel(stage: EvolutionStage): string {
  return ['Bebé', 'Niño', 'Joven', 'Adulto'][stage];
}

const DEFAULT_PET_NAMES: Record<PetType, string> = {
  dragon: 'Dragoncito', bunny: 'Conejita', dog: 'Perrito', cat: 'Gatito', rex: 'Rex',
};

export function getDefaultPetName(petType: PetType): string {
  return DEFAULT_PET_NAMES[petType] ?? 'Mascota';
}

/** Nombre a mostrar: el elegido por el chico, o el nombre por defecto de su especie */
export function getPetDisplayName(state: PetState): string {
  return state.petName?.trim() ? state.petName : getDefaultPetName(state.petType);
}

/** XP progress within the current stage (0–1) */
export function getXpProgress(state: PetState): number {
  const stage = state.evolutionStage;
  if (stage === 3) return 1;
  const current = state.totalXp - XP_THRESHOLDS[stage];
  const needed = XP_THRESHOLDS[(stage + 1) as EvolutionStage] - XP_THRESHOLDS[stage];
  return Math.min(1, current / needed);
}

/** XP earned for completing a game (scales with difficulty and score percentage) */
export function computeGameXp(difficulty: 1 | 2 | 3, scorePercent: number): number {
  const base = difficulty * 20;
  return Math.round(base * scorePercent);
}
