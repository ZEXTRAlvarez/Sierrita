import { getDifficultyState, upsertDifficultyState } from '@sierrita/storage';
import { createInitialDifficultyState } from '@sierrita/adaptive';
import type { DifficultyState } from '@sierrita/adaptive';

/** Loads the saved difficulty state for this profile/game, seeding a fresh one on first play. */
export async function loadOrCreateDifficultyState(
  profileId: string,
  gameId: string,
): Promise<DifficultyState> {
  const existing = await getDifficultyState(profileId, gameId);
  if (existing) return existing;

  const created = createInitialDifficultyState(profileId, gameId);
  await upsertDifficultyState(created);
  return created;
}
