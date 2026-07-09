import type { ParentConfig } from '../types';

/** Config por defecto para un perfil recién creado (sin PIN configurado aún). */
export function createDefaultParentConfig(profileId: string): ParentConfig {
  return {
    profileId,
    pinHash: '',
    maxSessionMinutes: 30,
    worldsEnabled: ['jungle', 'ocean', 'space'],
    updatedAt: Date.now(),
  };
}
