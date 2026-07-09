import { useCallback } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { profilesAtom, activeProfileIdAtom, petStateAtom } from '../store/atoms';
import { getAllProfiles, createProfile, deleteProfile } from '@sierrita/storage';
import { upsertPetState, upsertParentConfig } from '@sierrita/storage';
import { createInitialPetState } from '@sierrita/pet';
import { createDefaultParentConfig } from '@sierrita/parents';
import type { Profile, PetType } from '@sierrita/profiles';

export function useProfiles() {
  const [profiles, setProfiles] = useAtom(profilesAtom);
  const [activeProfileId, setActiveProfileId] = useAtom(activeProfileIdAtom);
  const setPetState = useSetAtom(petStateAtom);

  const loadProfiles = useCallback(async () => {
    const loaded = await getAllProfiles();
    setProfiles(loaded);
    return loaded;
  }, [setProfiles]);

  const addProfile = useCallback(
    async (name: string, age: 4 | 5 | 6, avatar: PetType): Promise<Profile> => {
      const id = `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const profile: Profile = {
        id, name, age, avatar,
        createdAt: Math.floor(Date.now() / 1000),
      };
      await createProfile(profile);
      const pet = createInitialPetState(id, avatar);
      await upsertPetState(pet);
      await upsertParentConfig(createDefaultParentConfig(id));
      setProfiles((prev) => [...prev, profile]);
      return profile;
    },
    [setProfiles],
  );

  const removeProfile = useCallback(
    async (id: string) => {
      await deleteProfile(id);
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      if (activeProfileId === id) {
        setActiveProfileId(null);
        setPetState(null);
      }
    },
    [activeProfileId, setActiveProfileId, setProfiles, setPetState],
  );

  const selectProfile = useCallback(
    (id: string) => setActiveProfileId(id),
    [setActiveProfileId],
  );

  const activeProfile = profiles.find((p) => p.id === activeProfileId) ?? null;

  return { profiles, activeProfile, activeProfileId, loadProfiles, addProfile, removeProfile, selectProfile };
}
